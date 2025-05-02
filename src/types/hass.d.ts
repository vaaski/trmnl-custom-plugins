export type HASSResponse = {
	entity_id?: string
	state: string
	attributes?: object
	last_changed: string
	last_updated?: string
}

export type HassTRMNLData = {
	name: string
	minMax: string
	states: string
}
