import * as environment from "./environment"
import path from "node:path"

/**
 * is it between friday 14:00 and sunday 20:00?
 */
export const weekendWorkTime = () => {
	const now = new Date()
	const day = now.getDay()
	const hour = now.getHours()

	if (day === 5 && hour >= 14) {
		return true
	}
	if (day === 6) {
		return true
	}
	if (day === 0 && hour < 20) {
		return true
	}
	return false
}

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
})
export const formatDate = (date: Date | number) => {
	return dateFormatter.format(date)
}

export const publicStaticFile = async (fileName: string, mimeType: string) => {
	return new Response(
		await Bun.file(path.join(import.meta.dir, "../public", fileName)).bytes(),
		{ headers: { "Content-Type": mimeType } },
	)
}

export const checkAuth = (request: Request) => {
	if (
		request.headers.get("Authorization") !== environment.SHARED_SECRET &&
		!environment.DISABLE_AUTH
	) {
		return new Response(undefined, { status: 401 })
	}
}
