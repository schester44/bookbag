import localforage from 'localforage'
import nanoid from 'nanoid'

async function getNoteIds() {
	return (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }
}

async function getTags() {
	return (await localforage.getItem('tags')) || { idMap: {}, ids: [] }
}

async function getTagRelationships() {
	return (
		(await localforage.getItem('noteTags')) || {
			byTag: {},
			byNote: {}
		}
	)
}
export default {
	tags: {
		getAll: async () => {
			return await getTags()
		},
		getByNote: async noteId => {
			const relationships = await getTagRelationships()

			return relationships.byNote[noteId] || []
		},
		save: async (tagId, tag) => {
			const id = tagId || nanoid()

			const tags = await getTags()

			if (!tags.idMap[id]) {
				tags.ids.unshift(id)
			}

			tags.idMap[id] = { id, ...tag }

			await Promise.all([localforage.setItem('tags', tags)])

			return { id, ...tag }
		},
		addToNote: async (tagId, noteId) => {
			const tagRelations = await getTagRelationships()

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
			const tagRelations = await getTagRelationships()

			if (tagRelations.byTag[tagId]) {
				tagRelations.byTag[tagId] = tagRelations.byTag[tagId].filter(id => id !== noteId)
			}

			if (tagRelations.byNote[noteId]) {
				tagRelations.byNote[noteId] = tagRelations.byNote[noteId].filter(id => id !== tagId)
			}

			return localforage.setItem('noteTags', tagRelations)
		}
	},

	notes: {
		lastOpened: {
			save: id => {
				return localforage.setItem('last-opened', id)
			},
			get: () => {
				return localforage.getItem('last-opened')
			}
		},

		getAll: async () => {
			const noteIds = await getNoteIds()

			const notes = await Promise.all(noteIds.all.map(id => localforage.getItem(`note-${id}`)))

			const notesById = notes.reduce((acc, note) => {
				acc[note.id] = note
				return acc
			}, {})

			return {
				notes,
				noteIds: noteIds.all.sort((a, b) => notesById[b].lastUpdate - notesById[a].lastUpdate),
				notesById
			}
		},
		getById: id => {
			return localforage.getItem(`note-${id}`)
		},
		delete: async noteId => {
			const noteIds = await getNoteIds()

			delete noteIds.idMap[noteId]

			noteIds.all = noteIds.all.filter(id => id !== noteId)

			localforage.setItem('noteIds', noteIds)

			localforage.removeItem(`note-${noteId}`)
		},
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
		}
	}
}
