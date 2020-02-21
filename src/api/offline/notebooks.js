import localforage from 'localforage'
import nanoid from 'nanoid'

export async function getNotebooks() {
	return (await localforage.getItem('notebooks')) || { idMap: {}, ids: [] }
}

function saveNotebooks(notebooks) {
	return localforage.setItem('notebooks', notebooks)
}

export default {
	getAll: getNotebooks,
	save: async (bookId, notebook) => {
		const id = bookId || nanoid()

		const notebooks = await getNotebooks()

		// if the notebook doesn't exist in the array of IDs then add it.
		if (!notebooks.idMap[id]) {
			notebooks.ids.unshift(id)
		}

		notebooks.idMap[id] = { id, ...notebook }

		await saveNotebooks(notebooks)

		return { id, ...notebook }
	},
	delete: async id => {
		const notebooks = await getNotebooks()
		notebooks.ids = notebooks.ids.filter(bookId => bookId !== id)
		delete notebooks.idMap[id]

		saveNotebooks(notebooks)

		return true
	}
}
