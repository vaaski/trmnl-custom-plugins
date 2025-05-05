const getVariable = (key: string, defaultValue?: string) => {
	const value = process.env[key]

	if (value) return value
	if (defaultValue !== undefined) return defaultValue

	throw new Error(`Environment variable ${key} is not set`)
}

export const OBSIDIAN_DAILY_NOTES_PATH = getVariable(
	"OBSIDIAN_DAILY_NOTES_PATH",
	"/notes",
)
export const SERVER_PORT = Number.parseInt(getVariable("SERVER_PORT", "7834"))
export const TRMNL_API_KEY = getVariable("TRMNL_API_KEY")

export const HASS_ADDRESS = getVariable("HASS_ADDRESS")
export const HASS_TOKEN = getVariable("HASS_TOKEN")
export const HASS_ENTITIES = getVariable("HASS_ENTITIES")

export const BRIGHTSKY_LAT = getVariable("BRIGHTSKY_LAT")
export const BRIGHTSKY_LON = getVariable("BRIGHTSKY_LON")
