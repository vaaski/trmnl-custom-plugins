const getVariable = (key: string, defaultValue?: string) => {
	const value = process.env[key]

	if (value) return value
	if (defaultValue !== undefined) return defaultValue

	throw new Error(`Environment variable ${key} is not set`)
}

export const OBSIDIAN_DAILY_NOTES_PATH = getVariable("OBSIDIAN_DAILY_NOTES_PATH")
export const DEV_PORT = Number.parseInt(getVariable("DEV_PORT", "7834"))
