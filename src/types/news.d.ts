export type RSSResponse = {
	"?xml": string
	rss: RSS
}

export type RSS = {
	channel: Channel
}

export type Channel = {
	title: string
	link: string
	description: string
	language: string
	pubDate: string
	lastBuildDate: string
	image: Image
	"atom:link": string
	item: Item[]
}

export type Image = {
	title: string
	link: string
	url: string
}

export type Item = {
	title: string
	link: string
	description: string
	"content:encoded": string
	category: string
	enclosure: string
	guid: string
	pubDate: string
}
