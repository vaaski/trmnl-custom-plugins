export type Item = {
	content: string
	depth: number
	checked: boolean
}
type Column = {
	title: string
	items: Item[]
}
export type Notes = {
	columns: Column[]
	date: string
}
