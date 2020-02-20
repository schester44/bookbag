import localforage from 'localforage'
import nanoid from 'nanoid'
import notesApi, { getNotebooks } from './notebooks'

async function getNoteIds() {
	return (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }
}

async function getTrash() {
	return (await localforage.getItem('trash')) || { idMap: {}, ids: [] }
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

async function deleteNote(noteId) {
	const noteIds = await getNoteIds()

	delete noteIds.idMap[noteId]

	noteIds.all = noteIds.all.filter(id => id !== noteId)

	localforage.setItem('noteIds', noteIds)
	localforage.removeItem(`note-${noteId}`)
}

export default {
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

		if (note.notebookId) {
			// TODO: should I save a map of notebookid={noteIds}
			const notebooks = await getNotebooks()

			if (notebooks.idMap[note.notebookId]) {
				// TODO: This is starting to get dirty
				if (!notebooks.idMap[note.notebookId].notes.includes(id)) {
					notesApi.save(note.notebookId, {
						...notebooks.idMap[note.notebookId],
						notes: notebooks.idMap[note.notebookId].notes.concat(id)
					})
				}
			}
		}

		const promises = [
			localforage.setItem(`note-${id}`, updatedNote),
			localforage.setItem('noteIds', noteIds)
		]

		await Promise.all(promises)

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
