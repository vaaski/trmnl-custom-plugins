import * as environment from "./environment"

export type HASSResponse = {
	entity_id?: string
	state: string
	attributes?: object
	last_changed: string
	last_updated?: string
}

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

	return [`${name} ${lastValue}${unit}`, minMax]
}

export const getHassDetails = async () => {
	const requestUrl = new URL("/api/history/period", environment.HASS_ADDRESS)
	requestUrl.searchParams.set("filter_entity_id", environment.HASS_ENTITIES)
	requestUrl.searchParams.set("no_attributes", "")
	requestUrl.searchParams.set("minimal_response", "")

	const dataRequest = await fetch(requestUrl, {
		headers: {
			Authorization: `Bearer ${environment.HASS_TOKEN}`,
		},
	})

	const data = (await dataRequest.json()) as HASSResponse[][]

	return data.map((dataList) => {
		const [name, minMax] = getEntityMeta(dataList)

		return {
			name,
			minMax: JSON.stringify(minMax),
			states: JSON.stringify(
				dataList.map((state) => [new Date(state.last_changed).getTime(), state.state]),
			),
		}
	})
}
