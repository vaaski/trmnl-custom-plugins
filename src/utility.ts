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
