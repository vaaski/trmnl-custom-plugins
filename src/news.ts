import type { RSSResponse } from "./types/news"

import { XMLParser } from "fast-xml-parser"

const NEWS_SOURCE = "https://www.spiegel.de/schlagzeilen/tops/index.rss"

const parser = new XMLParser()
const dateFormatter = new Intl.DateTimeFormat("de-DE", {
	weekday: "long",
	hour: "numeric",
	minute: "numeric",
})

export const getNews = async () => {
	const response = await fetch(NEWS_SOURCE)
	const xmlData = await response.text()

	const data = parser.parse(xmlData) as RSSResponse

	return {
		logo: data.rss.channel.image.url,
		title: data.rss.channel.title,
		stories: data.rss.channel.item.map((item) => ({
			title: item.title,
			description: item.description,
			date: dateFormatter.format(new Date(item.pubDate)),
			category: item.category,
		})),
	}
}
