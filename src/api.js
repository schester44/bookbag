import localforage from 'localforage'
import nanoid from 'nanoid'

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

function saveNoteTags(noteTags) {
	return localforage.setItem('noteTags', noteTags)
}

async function getNoteTags() {
	return (
		(await localforage.getItem('noteTags')) || {
			byTag: {},
			byNote: {}
		}
	)
}

async function tagsByNote(noteId) {
	const relationships = await getNoteTags()

	return relationships.byNote[noteId] || []
}

async function deleteNote(noteId) {
	const noteIds = await getNoteIds()

	delete noteIds.idMap[noteId]

	noteIds.all = noteIds.all.filter(id => id !== noteId)

	localforage.setItem('noteIds', noteIds)
	localforage.removeItem(`note-${noteId}`)
}

export default {
	tags: {
		getAll: getTags,
		getByNote: tagsByNote,
		save: async (tagId, tag) => {
			const id = tagId || nanoid()

			const tags = await getTags()

			if (!tags.idMap[id]) {
				tags.ids.unshift(id)
			}

			tags.idMap[id] = { id, ...tag }

			saveTags(tags)

			return { id, ...tag }
		},
		addToNote: async (tagId, noteId) => {
			const tagRelations = await getNoteTags()

			if (!tagRelations.byTag[tagId]) {
				tagRelations.byTag[tagId] = []
			}
			if (!tagRelations.byNote[noteId]) {
				tagRelations.byNote[noteId] = []
			}

			if (!tagRelations.byNote[noteId].includes(tagId)) {
				tagRelations.byNote[noteId].push(tagId)
			}

			if (!tagRelations.byTag[tagId].includes(noteId)) {
				tagRelations.byTag[tagId].push(noteId)
			}

			return localforage.setItem('noteTags', tagRelations)
		},
		removeFromNote: async (tagId, noteId) => {
			const tagRelations = await getNoteTags()

			if (tagRelations.byTag[tagId]) {
				tagRelations.byTag[tagId] = tagRelations.byTag[tagId].filter(id => id !== noteId)
			}

			if (tagRelations.byNote[noteId]) {
				tagRelations.byNote[noteId] = tagRelations.byNote[noteId].filter(id => id !== tagId)
			}

			return localforage.setItem('noteTags', tagRelations)
		}
	},

	trash: {
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
	},
	notes: {
		getAll: async () => {
			const ids = await getNoteIds()

			const notes = await Promise.all(ids.all.map(id => localforage.getItem(`note-${id}`)))

			const idMap = notes.reduce((acc, note) => {
				acc[note.id] = note
				return acc
			}, {})

			return {
				ids: ids.all,
				idMap
			}
		},
		getById: id => {
			return localforage.getItem(`note-${id}`)
		},
		delete: deleteNote,
		save: async (noteId, note) => {
			const noteIds = await getNoteIds()

			const id = noteId || nanoid()

			if (!noteIds.idMap[id]) {
				noteIds.idMap[id] = true
				noteIds.all.unshift(id)
			}

			const updatedNote = { ...note, id, lastUpdate: new Date() }

			await Promise.all([
				localforage.setItem(`note-${id}`, updatedNote),
				localforage.setItem('noteIds', noteIds)
			])

			return updatedNote
		},
		sendToTrash: async ({ note, trashedAt }) => {
			const trash = await getTrash()

			const tags = await getNoteTags()
			let relatedTags = []

			if (tags.byNote[note.id]?.length > 0) {
				relatedTags = [...tags.byNote[note.id]]

				// Remove any associated tags
				tags.byNote[note.id].forEach(tagId => {
					tags.byTag[tagId] = tags.byTag[tagId].filter(noteId => noteId !== note.id)
				})

				saveNoteTags(tags)
			}

			delete tags.byNote[note.id]

			trash.ids.push(note.id)

			const trashedNote = {
				id: note.id,
				note,
				trashedAt,
				relations: {
					tags: relatedTags
				}
			}

			trash.idMap[note.id] = trashedNote

			deleteNote(note.id)
			localforage.setItem('trash', trash)

			return trashedNote
		},
		lastOpened: {
			save: id => {
				return localforage.setItem('last-opened', id)
			},
			get: () => {
				return localforage.getItem('last-opened')
			}
		}
	}
}
