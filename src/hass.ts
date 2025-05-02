import type { HASSResponse, HassTRMNLData } from "./types/hass"

import { getCurrentWeather } from "./brightsky"
import * as environment from "./environment"

const getEntityMeta = (dataList: HASSResponse[]) => {
	const entityName = dataList?.[0]?.entity_id ?? "entity id missing"

	const name = entityName.replace("sensor.", "").replace("_temp", "").replaceAll("_", " ")

	const lastValue = dataList.at(-1)?.state ?? "idk "
	const isHumidity = name.endsWith("humidity")

	const unit = isHumidity ? "%" : "°C"
	const minMax = {
		min: isHumidity ? 35 : 10,
		max: isHumidity ? 65 : 30,
	}

	return {
		name: `${name} ${lastValue}${unit}`,
		minMax,
		isHumidity,
	}
}

const transformCurrentWeather = async (): Promise<[HassTRMNLData, HassTRMNLData]> => {
	const data = await getCurrentWeather()

	const humidity = {
		name: "outside humidity",
		minMax: JSON.stringify({ min: 35, max: 65 }),
		states: JSON.stringify(
			data.weather.map((weather) => [
				new Date(weather.timestamp).getTime(),
				weather.relative_humidity,
			]),
		),
	}

	const temperature = {
		name: "outside temperature",
		minMax: JSON.stringify({ min: 10, max: 30 }),
		states: JSON.stringify(
			data.weather.map((weather) => [
				new Date(weather.timestamp).getTime(),
				weather.temperature,
			]),
		),
	}

	const reversed = [...data.weather].reverse()
	const lastHumidity = reversed.find((weather) => weather.relative_humidity)
	const lastTemperature = reversed.find((weather) => weather.temperature)

	if (lastHumidity) {
		humidity.name += ` ${lastHumidity.relative_humidity}%`
	}
	if (lastTemperature) {
		temperature.name += ` ${lastTemperature.temperature}°C`
	}

	return [humidity, temperature]
}

export const getHassDetails = async (): Promise<[HassTRMNLData[], HassTRMNLData[]]> => {
	const requestUrl = new URL("/api/history/period", environment.HASS_ADDRESS)
	requestUrl.searchParams.set("filter_entity_id", environment.HASS_ENTITIES)
	requestUrl.searchParams.set("no_attributes", "")
	requestUrl.searchParams.set("minimal_response", "")

	console.log("requesting", requestUrl.toString())
	const dataRequest = await fetch(requestUrl, {
		headers: {
			Authorization: `Bearer ${environment.HASS_TOKEN}`,
		},
	})

	const data = (await dataRequest.json()) as HASSResponse[][]

	const withMeta = data.map((dataList) => {
		return {
			dataList,
			meta: getEntityMeta(dataList),
		}
	})

	const dataMapper = (data: (typeof withMeta)[number]) => {
		return {
			name: data.meta.name,
			minMax: JSON.stringify(data.meta.minMax),
			states: JSON.stringify(
				data.dataList.map((state) => [
					new Date(state.last_changed).getTime(),
					state.state,
				]),
			),
		}
	}

	const humidity = withMeta
		.filter((item) => item.meta.isHumidity)
		.map((element) => dataMapper(element))

	const temperature = withMeta
		.filter((item) => !item.meta.isHumidity)
		.map((element) => dataMapper(element))

	const [outsideHumidity, outsideTemperature] = await transformCurrentWeather()
	humidity.push(outsideHumidity)
	temperature.push(outsideTemperature)

	return [humidity, temperature]
}
