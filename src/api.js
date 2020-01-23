import localforage from 'localforage'
import nanoid from 'nanoid'
export default {
	notes: {
		getAll: async () => {
			const noteIds = (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }

			const notes = await Promise.all(noteIds.all.map(id => localforage.getItem(`note-${id}`)))

			return notes.sort((a, b) => b.lastUpdate - a.lastUpdate)
		},
		getById: id => {
			return localforage.getItem(`note-${id}`)
		},
		save: async (noteId, note) => {
			const noteIds = (await localforage.getItem('noteIds')) || { idMap: {}, all: [] }

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
