export function debounce(f, interval) {
	let timer = null

	return (...args) => {
		clearTimeout(timer)
		return new Promise(resolve => {
			console.log('hi', interval);
			timer = setTimeout(() => resolve(f(...args)), interval)
		})
	}
}