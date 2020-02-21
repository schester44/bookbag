import localforage from 'localforage'

async function getNoteIds() {
	return (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }
}

async function getTags() {
	return (await localforage.getItem('tags')) || { idMap: {}, ids: [] }
}

async function getTrash() {
	return (await localforage.getItem('trash')) || { idMap: {}, ids: [] }
}

function saveTrash(trash) {
	return localforage.setItem('trash', trash)
}

function saveTags(tags) {
	return localforage.setItem('tags', tags)
}

export default {
	getAll: getTrash,
	deleteNote: async ({ noteId }) => {
		const trash = await getTrash()

		trash.ids = trash.ids.filter(id => id !== noteId)

		delete trash.idMap[noteId]

		saveTrash(trash)
	},
	restore: async ({ noteId }) => {
		const [trash, noteIds] = await Promise.all([getTrash(), getNoteIds()])

		const { note, relations } = trash.idMap[noteId]

		if (relations.tags?.length > 0) {
			const tags = await getTags()
			tags.byNote[noteId] = relations.tags

			relations.tags.forEach(tagId => {
				if (tags.byTag[tagId]) {
					tags.byTag[tagId] = tags.byTag[tagId].concat(noteId)
				}
			})

			saveTags(tags)
		}

		trash.ids = trash.ids.filter(id => id !== noteId)

		delete trash.idMap[note.id]

		await Promise.all([
			localforage.setItem(`note-${noteId}`, note),
			localforage.setItem('noteIds', noteIds)
		])

		saveTrash(trash)

		return note
	}
}
