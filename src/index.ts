import * as environment from "./environment"
import { getNotesJson } from "./obsidian"
import { checkAuth, publicStaticFile } from "./utility"

Bun.serve({
	port: environment.DEV_PORT,
	routes: {
		"/ping": new Response("pong"),
		"/notes": async (request) => {
			const forbidden = checkAuth(request)
			if (forbidden) return forbidden

			console.log("received request", request.headers.toJSON())

			return Response.json(await getNotesJson())
		},

		"/icon": await publicStaticFile("obsidian-flat.svg", "image/svg+xml"),
		"/placeholder": await publicStaticFile("placeholder.png", "image/png"),
	},
})

console.log(`obsidian-daily-notes server started on port ${environment.DEV_PORT}`)
