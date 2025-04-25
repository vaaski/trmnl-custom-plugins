import { readdir } from "node:fs/promises"
import * as environment from "./environment"
import path from "node:path"

const getNotesJson = async () => {
	const files = await readdir(environment.OBSIDIAN_DAILY_NOTES_PATH)
	const [newestFileName] = files.sort((a, b) => {
		return (
			new Date(b.replace(".md", "")).getTime() - new Date(a.replace(".md", "")).getTime()
		)
	})

	if (!newestFileName) throw new Error("No files found")

	const file = Bun.file(path.join(environment.OBSIDIAN_DAILY_NOTES_PATH, newestFileName))
	const fileContent = await file.text()

	console.log(fileContent)
}

console.log(await getNotesJson())

Bun.serve({
	port: environment.DEV_PORT,
	routes: {
		// Static routes
		"/status": new Response("OKe"),
		"/static-test": Response.json({ testData: "yup tester" }),

		// 	// Dynamic routes
		// 	"/users/:id": (req) => {
		// 		return new Response(`Hello User ${req.params.id}!`)
		// 	},

		// 	// Per-HTTP method handlers
		// 	"/api/posts": {
		// 		GET: () => new Response("List posts"),
		// 		POST: async (req) => {
		// 			const body = await req.json()
		// 			return Response.json({ created: true, ...body })
		// 		},
		// 	},

		// 	// Wildcard route for all routes that start with "/api/" and aren't otherwise matched
		// 	"/api/*": Response.json({ message: "Not found" }, { status: 404 }),

		// 	// Redirect from /blog/hello to /blog/hello/world
		// 	"/blog/hello": Response.redirect("/blog/hello/world"),

		// 	// Serve a file by buffering it in memory
		// 	"/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
		// 		headers: {
		// 			"Content-Type": "image/x-icon",
		// 		},
		// 	}),
	},

	// // (optional) fallback for unmatched routes:
	// // Required if Bun's version < 1.2.3
	// fetch(req) {
	// 	return new Response("Not Found", { status: 404 })
	// },
})
