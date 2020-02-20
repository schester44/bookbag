import { createReducer } from '@reduxjs/toolkit'

import { notesFetched, noteSaved, noteCreated, notesInitialized } from '../notes/actions'
import { noteTrashed, noteRestored } from '../trash/actions'

export default createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[notesInitialized]: (state, { payload }) => {
			if (payload.isNewNote) {
				state.ids.unshift(payload.activeNote.id)
				state.idMap[payload.activeNote.id] = payload.activeNote
			}
		},
		[noteSaved]: (state, { payload }) => {
			state.idMap[payload.note.id] = payload.note
		},
		[noteTrashed]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.note.id)
			delete state.idMap[payload.note.id]

			if (payload.newNote) {
				state.ids.unshift(payload.newNote.id)
				state.idMap[payload.newNote.id] = payload.newNote
			}
		},
		[noteRestored]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		},
		[notesFetched]: (state, { payload }) => {
			state.ids = payload.notes.ids.sort((a, b) => {
				return payload.notes.idMap[b].lastUpdate - payload.notes.idMap[a].lastUpdate
			})

			state.idMap = payload.notes.idMap
		},
		[noteCreated]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		}
	}
)
