import { createAction } from '@reduxjs/toolkit'

import api from '../../api'

export const tagsFetched = createAction('TAGS_FETCHED')
export const noteTagsFetched = createAction('NOTE_TAGS_FETCHED')
export const tagCreated = createAction('TAG_CREATED')
export const noteTagged = createAction('NOTE_TAGGED')
export const noteTagRemoved = createAction('NOTE_TAG_REMOVED')

export const fetchTags = () => {
	return async dispatch => {
		const tags = await api.tags.getAll()

		dispatch(tagsFetched({ tags }))
	}
}

export const fetchNoteTags = noteId => {
	return async dispatch => {
		const tags = await api.tags.getByNote(noteId)

		dispatch(noteTagsFetched({ noteId, tags }))
	}
}

export const createNote = name => {
	return dispatch => {
		return api.tags.save(null, { name }).then(tag => {
			dispatch(tagCreated({ tag }))
			return tag
		})
	}
}

export const createNoteTag = (noteId, name) => {
	return async (dispatch, getState) => {
		const { tags } = getState()

		const existingTagId = tags.ids.find(id => {
			const tag = tags.idMap[id]
			return tag.name.toLowerCase() === name.toLowerCase().trim()
		})

		let tag

		if (!existingTagId) {
			tag = await dispatch(createNote(name))
		} else {
			tag = tags.idMap[existingTagId]
		}

		// TODO: error
		if (!tag) return

		dispatch(noteTagged({ noteId, tagId: tag.id }))

		api.tags.addToNote(tag.id, noteId)
	}
}

export const removeNoteTag = (noteId, tagId) => {
	return dispatch => {
		api.tags.removeFromNote(tagId, noteId)
		dispatch(noteTagRemoved({ noteId, tagId }))
	}
}
