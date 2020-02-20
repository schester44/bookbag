import { createReducer } from '@reduxjs/toolkit'

import { noteTrashed, noteRestored, trashFetched, noteDeleted } from '../trash/actions'

export default createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[trashFetched]: (state, { payload }) => {
			state.ids = payload.trash.ids.sort((a, b) => {
				return payload.trash.idMap[b].trashedAt - payload.trash.idMap[a].trashedAt
			})

			state.idMap = payload.trash.idMap
		},
		[noteRestored]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.note.id)
			delete state.idMap[payload.note.id]
		},
		[noteTrashed]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		},
		[noteDeleted]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.noteId)
			delete state.idMap[payload.noteId]
		}
	}
)
