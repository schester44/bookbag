import { createBrowserHistory } from 'history'
import nanoid from 'nanoid'

export const history = createBrowserHistory()

export function debounce(f, interval) {
	let timer = null

	return (...args) => {
		clearTimeout(timer)
		return new Promise((resolve) => {
			timer = setTimeout(() => resolve(f(...args)), interval)
		})
	}
}

export const createNewNote = () => {
	return {
		id: nanoid(),
		title: '',
		snippet: '',
		updatedAt: new Date().toISOString(),
		createdAt: new Date().toISOString(), 
		trashed: false,
		body: JSON.stringify([
			{
				type: 'paragraph',
				children: [{ text: '' }],
			},
		]),
		__typename: 'Note'
	}
}
