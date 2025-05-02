import type { BrightskyResponse } from "./types/brightsky"

import * as environment from "./environment"

export const getCurrentWeather = async () => {
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate() - 1)

	const requestUrl = new URL("https://api.brightsky.dev/weather")
	requestUrl.searchParams.set("lat", environment.BRIGHTSKY_LAT)
	requestUrl.searchParams.set("lon", environment.BRIGHTSKY_LON)
	requestUrl.searchParams.set("date", yesterday.toISOString())
	requestUrl.searchParams.set("last_date", new Date().toISOString())

	console.log("requesting", requestUrl.toString())
	const response = await fetch(requestUrl)
	const data = await response.json()

	return data as BrightskyResponse
}
