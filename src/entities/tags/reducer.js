import { createReducer } from '@reduxjs/toolkit'
import union from 'lodash/union'

import {
	tagsFetched,
	tagCreated,
	noteTagsFetched,
	noteTagged,
	noteTagRemoved
} from '../tags/actions'

import { noteTrashed, noteRestored } from '../trash/actions'

export default createReducer(
	{
		byNote: {},
		ids: [],
		idMap: {}
	},
	{
		[noteTagRemoved]: (state, { payload }) => {
			state.byNote[payload.noteId] = state.byNote[payload.noteId].filter(id => id !== payload.tagId)
		},
		[tagCreated]: (state, { payload }) => {
			state.ids.push(payload.tag.id)
			state.idMap[payload.tag.id] = payload.tag
		},

		[noteTagged]: (state, { payload }) => {
			state.byNote[payload.noteId] = union(state.byNote[payload.noteId], [payload.tagId])
		},
		[noteTagsFetched]: (state, { payload }) => {
			state.byNote[payload.noteId] = payload.tags
		},
		[tagsFetched]: (state, { payload }) => {
			state.ids = payload.tags.ids
			state.idMap = payload.tags.idMap
		},
		[noteRestored]: (state, { payload }) => {
			if (payload.note.relations?.tags) {
				state.byNote[payload.note.id] = payload.note.relations.tags

				payload.note.relations.tags.forEach(tagId => {
					state.idMap[tagId] = state.idMap[tagId].concat(payload.note.id)
				})
			}
		},
		[noteTrashed]: (state, { payload }) => {
			if (state.byNote[payload.note.id]?.length > 0) {
				delete state.byNote[payload.note.id]
			}
		}
	}
)

const defaultTagsArray = []

export const activeNoteTagsSelector = noteId => state => {
	return state.tags.byNote[noteId] || defaultTagsArray
}
