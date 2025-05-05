import * as environment from "./environment"
import { getHassDetails } from "./hass"
import { getNews } from "./news"
import { getNotesJson } from "./obsidian"
import { checkAuth, publicStaticFile } from "./utility"

Bun.serve({
	port: environment.SERVER_PORT,
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

		"/news": async (request) => {
			const forbidden = checkAuth(request)
			if (forbidden) return forbidden

			console.log("received /news request", request.headers.toJSON())

			return Response.json(await getNews())
		},

		"/icon-hass": await publicStaticFile("hass.svg", "image/svg+xml"),
		"/icon-obsidian": await publicStaticFile("obsidian.svg", "image/svg+xml"),
		"/placeholder": await publicStaticFile("placeholder.png", "image/png"),
	},
})

console.log(`trmnl-plugin server started on port ${environment.SERVER_PORT}`)
