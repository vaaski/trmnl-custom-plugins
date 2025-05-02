import * as environment from "./environment"
import { getHassDetails } from "./hass"
import { getNotesJson } from "./obsidian"
import { checkAuth, publicStaticFile } from "./utility"

Bun.serve({
	port: environment.DEV_PORT,
	development: false,
	routes: {
		"/ping": new Response("pong"),

		"/notes": async (request) => {
			const forbidden = checkAuth(request)
			if (forbidden) return forbidden

			console.log("received /notes request", request.headers.toJSON())

			return Response.json(await getNotesJson())
		},

		"/hass": async (request) => {
			const forbidden = checkAuth(request)
			if (forbidden) return forbidden

			console.log("received /hass request", request.headers.toJSON())

			return Response.json(await getHassDetails())
		},

		"/icon-hass": await publicStaticFile("hass.svg", "image/svg+xml"),
		"/icon-obsidian": await publicStaticFile("obsidian.svg", "image/svg+xml"),
		"/placeholder": await publicStaticFile("placeholder.png", "image/png"),
	},
})

console.log(`trmnl-plugin server started on port ${environment.DEV_PORT}`)
