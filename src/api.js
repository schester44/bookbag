import localforage from 'localforage'
import nanoid from 'nanoid'

async function getNoteIds() {
	return (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }
}

export default {
	notes: {
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
