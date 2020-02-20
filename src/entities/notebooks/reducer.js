import { createReducer } from '@reduxjs/toolkit'

import { booksFetched, bookCreated, bookUpdated, bookDeleted } from './actions'
import { noteSaved } from '../notes/actions'

// TODO: When restoring a note from the trash, it needs to go back into its original folder, if the folder exists.

export default createReducer(
	{
		noteIdMapByBookId: {},
		ids: [],
		idMap: {}
	},
	{
		[booksFetched]: (state, { payload }) => {
			state.ids = payload.notebooks.ids
			state.idMap = payload.notebooks.idMap
		},
		[bookCreated]: (state, { payload }) => {
			state.ids.unshift(payload.notebook.id)
			state.idMap[payload.notebook.id] = payload.notebook
		},
		[bookUpdated]: (state, { payload }) => {
			state.idMap[payload.notebook.id] = payload.notebook
		},
		[bookDeleted]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.id)

			delete state.idMap[payload.id]
		},
		[noteSaved]: (state, { payload }) => {
			// This note doesn't belong to a notebook so theres no reason to update any books
			if (!payload.note?.notebookId) return

			const note = payload.note

			if (!state.noteIdMapByBookId[note.notebookId]) {
				state.noteIdMapByBookId[note.notebookId] = {}
			}

			if (!state.noteIdMapByBookId[note.notebookId][note.id]) {
				state.noteIdMapByBookId[note.notebookId][note.id] = true

				// This should never happen... but if it does
				if (!state.idMap[note.notebookId]) return

				state.idMap[note.notebookId].notes.push(note.id)
			}
		}
	}
)
