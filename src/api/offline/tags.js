import localforage from 'localforage'
import nanoid from 'nanoid'

async function getTags() {
	return (await localforage.getItem('tags')) || { idMap: {}, ids: [] }
}

function saveTags(tags) {
	return localforage.setItem('tags', tags)
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

function saveNoteTags(tagRelations) {
	return localforage.setItem('noteTags', tagRelations)
}

export default {
	getAll: getTags,
	getByNote: tagsByNote,
	getNoteTags,
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

		return saveNoteTags(tagRelations)
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
}
