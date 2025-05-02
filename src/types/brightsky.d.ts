export type BrightskyResponse = {
	weather: Weather[]
	sources: Source[]
}

export type Source = {
	id: number
	dwd_station_id: string
	observation_type: string
	lat: number
	lon: number
	height: number
	station_name: string
	wmo_station_id: string
	first_record: string
	last_record: string
	distance: number
}

export type Weather = {
	timestamp: string
	source_id: number
	precipitation: number
	pressure_msl: null
	sunshine: null
	temperature: number
	wind_direction: number
	wind_speed: number
	cloud_cover: null
	dew_point: number
	relative_humidity: number
	visibility: null
	wind_gust_direction: number | null
	wind_gust_speed: number
	condition: null
	precipitation_probability: null
	precipitation_probability_6h: null
	solar: null
	fallback_source_ids: FallbackSourceIDS
	icon: string
}

export type FallbackSourceIDS = {
	temperature?: number
	wind_speed?: number
	precipitation?: number
	dew_point?: number
	wind_direction?: number
	relative_humidity?: number
}
