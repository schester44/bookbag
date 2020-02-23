import { createReducer } from '@reduxjs/toolkit'
import union from 'lodash/union'

import { bookBagInitialized } from '../bookbag/actions'

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
		byTag: {},
		byNote: {},
		ids: [],
		idMap: {}
	},
	{
		[bookBagInitialized]: (state, { payload }) => {
			state.ids = payload.tags.ids
			state.idMap = payload.tags.idMap
			state.byTag = payload.noteTags.byTag
			state.byNote = payload.noteTags.byNote
		},
		[noteTagRemoved]: (state, { payload }) => {
			state.byNote[payload.noteId] = state.byNote[payload.noteId].filter(id => id !== payload.tagId)
			state.byTag[payload.tagId] = state.byTag[payload.tagId].filter(id => id !== payload.noteId)
		},
		[tagCreated]: (state, { payload }) => {
			state.ids.push(payload.tag.id)
			state.idMap[payload.tag.id] = payload.tag
			state.byTag[payload.tag.id] = []
		},

		[noteTagged]: (state, { payload }) => {
			state.byNote[payload.noteId] = union(state.byNote[payload.noteId], [payload.tagId])
			;(state.byTag[payload.tagId] || []).push(payload.noteId)
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

					if (!state.byTag[tagId]) {
						state.byTag[tagId] = []
					}

					state.byTag[tagId].push(payload.note.id)
				})
			}
		},
		[noteTrashed]: (state, { payload }) => {
			if (state.byNote[payload.note.id]?.length > 0) {
				// Eww
				state.byNote[payload.note.id].forEach(tagId => {
					if (state.byTag[tagId]) {
						const index = state.byTag[tagId].findIndex(id => id === payload.note.id)

						if (index > -1) {
							state.byTag[tagId].splice(index, 1)
						}
					}
				})

				delete state.byNote[payload.note.id]
			}
		}
	}
)

const defaultTagsArray = []

export const activeNoteTagsSelector = noteId => state => {
	return state.tags.byNote[noteId] || defaultTagsArray
}
