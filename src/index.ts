import { readdir } from "node:fs/promises"
import path from "node:path"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import { unified } from "unified"
import * as environment from "./environment"
import type { List } from "mdast"
import { formatDate, weekendWorkTime } from "./utility"

type Item = {
	content: string
	depth: number
	checked: boolean
}

type Column = {
	title: string
	items: Item[]
}

type Notes = {
	columns: Column[]
	date: string
}

const parseList = (list: List, depth = 0): Item[] => {
	const items: Item[] = []

	for (const listItem of list.children) {
		if (listItem.type !== "listItem") continue

		// get the first paragraph in the list item
		const paragraph = listItem.children.find((child) => child.type === "paragraph")
		if (!paragraph) continue

		// combine all text nodes in the paragraph
		const content = paragraph.children
			.filter((child) => child.type === "text")
			.map((child) => child.value)
			.join("")

		// only include items with a checkbox
		if (listItem.checked !== undefined && listItem.checked !== null) {
			items.push({ content, depth, checked: listItem.checked })
		}

		// handle nested lists recursively
		const nestedList = listItem.children.find((child) => child.type === "list")
		if (nestedList) {
			const nestedItems = parseList(nestedList, depth + 1)
			items.push(...nestedItems)
		}
	}

	return items
}

const getNotesJson = async (): Promise<Notes> => {
	const files = await readdir(environment.OBSIDIAN_DAILY_NOTES_PATH)
	const [newestFileName] = files.sort((a, b) => {
		return (
			new Date(b.replace(".md", "")).getTime() - new Date(a.replace(".md", "")).getTime()
		)
	})

	if (!newestFileName) throw new Error("No files found")

	const file = Bun.file(path.join(environment.OBSIDIAN_DAILY_NOTES_PATH, newestFileName))
	const fileContent = await file.text()

	const markdownRoot = unified().use(remarkParse).use(remarkGfm).parse(fileContent)

	const categories: Record<string, Item[]> = {}

	let currentCategory: string | undefined
	for (const topLevel of markdownRoot.children) {
		if (topLevel.type === "heading") {
			const [headingText] = topLevel.children
			if (!headingText || headingText.type !== "text") continue

			currentCategory = headingText.value
		} else if (topLevel.type === "list") {
			if (!currentCategory) continue

			const items = parseList(topLevel)
			if (items.length > 0) categories[currentCategory] = items
		}
	}

	const life = categories["life"] ?? []

	const gym = categories["gym"] ?? []

	const work = categories["work"] ?? []

	const returnData: Notes = {
		date: formatDate(new Date(newestFileName.replace(".md", ""))),
		columns: [
			{
				title: "life",
				items: life,
			},
		],
	}

	if (weekendWorkTime()) {
		returnData.columns.push({
			title: "gym",
			items: gym,
		})
	} else {
		returnData.columns.push({
			title: "work",
			items: work,
		})
	}

	return returnData
}

Bun.serve({
	port: environment.DEV_PORT,
	routes: {
		"/ping": new Response("pong"),
		"/notes": async (request) => {
			if (
				request.headers.get("Authorization") !== environment.SHARED_SECRET &&
				!environment.DISABLE_AUTH
			) {
				return new Response(undefined, { status: 401 })
			}

			console.log("received request", request.headers.toJSON())

			return Response.json(await getNotesJson())
		},

		"/icon": new Response(
			await Bun.file(path.join(import.meta.dir, "../public/obsidian-flat.svg")).bytes(),
			{ headers: { "Content-Type": "image/svg+xml" } },
		),
		"/placeholder": new Response(
			await Bun.file(path.join(import.meta.dir, "../public/placeholder.png")).bytes(),
			{ headers: { "Content-Type": "image/png" } },
		),
	},
})

console.log(`obsidian-daily-notes server started on port ${environment.DEV_PORT}`)
