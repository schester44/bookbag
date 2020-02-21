import { createReducer } from '@reduxjs/toolkit'

import { bookBagInitialized } from '../bookbag/actions'
import { noteRemovedFromNotebook } from '../notebooks/actions'

import { notesFetched, noteSaved, noteCreated, noteDeleted } from '../notes/actions'

import { noteTrashed, noteRestored } from '../trash/actions'

export default createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[bookBagInitialized]: (state, { payload }) => {
			state.ids = payload.notes.ids.sort((a, b) => {
				return payload.notes.idMap[b].lastUpdate - payload.notes.idMap[a].lastUpdate
			})

			state.idMap = payload.notes.idMap

			if (payload.activeNote.isNewNote) {
				state.ids.unshift(payload.activeNote.id)

				// put the temporary activeNote into redux, when the activeNote is new, even though it isn't saved yet. we'll persist it once the user makes a change to the note.
				state.idMap[payload.activeNote.id] = payload.activeNote.note
			}
		},
		[noteSaved]: (state, { payload }) => {
			const indexOfNote = state.ids.findIndex(id => id === payload.note.id)

			if (indexOfNote !== 0) {
				state.ids.splice(indexOfNote, 1)
				state.ids.unshift(payload.note.id)
			}

			state.idMap[payload.note.id] = payload.note
		},
		[noteTrashed]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.note.id)
			delete state.idMap[payload.note.id]
		},
		[noteDeleted]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.noteId)
			delete state.idMap[payload.noteId]
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
		},
		[noteRemovedFromNotebook]: (state, { payload }) => {
			if (state.idMap[payload.noteId]) {
				state.idMap[payload.noteId].notebookId = undefined
			}
		}
	}
)
