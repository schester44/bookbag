import { createReducer } from '@reduxjs/toolkit'

import {
	booksFetched,
	bookCreated,
	bookUpdated,
	bookDeleted,
	noteRemovedFromNotebook
} from './actions'

import { noteSaved, notesFetched } from '../notes/actions'
import { noteTrashed, noteRestored } from '../trash/actions'

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
		[notesFetched]: (state, { payload }) => {
			payload.notes.ids.forEach(id => {
				const { notebookId } = payload.notes.idMap[id]

				if (!state.noteIdMapByBookId[notebookId]) {
					state.noteIdMapByBookId[notebookId] = {}
				}

				state.noteIdMapByBookId[notebookId][id] = true
			})
		},
		[noteSaved]: (state, { payload }) => {
			const { note, originalNotebookId } = payload

			// Remove the note from the original ID
			if (originalNotebookId && state.idMap[originalNotebookId]) {
				state.idMap[originalNotebookId].notes = state.idMap[originalNotebookId].notes.filter(
					id => id !== note.id
				)

				delete state.noteIdMapByBookId[originalNotebookId][note.id]
			}

			// This note doesn't belong to a notebook so theres no reason to update any books
			if (!note.notebookId) return

			if (!state.noteIdMapByBookId[note.notebookId]) {
				state.noteIdMapByBookId[note.notebookId] = {}
			}

			if (!state.noteIdMapByBookId[note.notebookId][note.id]) {
				state.noteIdMapByBookId[note.notebookId][note.id] = true

				// This should never happen... but if it does
				if (!state.idMap[note.notebookId]) return

				state.idMap[note.notebookId].notes.push(note.id)
			}
		},
		[noteTrashed]: (state, { payload }) => {
			const { note } = payload

			const {
				id,
				note: { notebookId }
			} = note

			if (!notebookId) return

			if (state.noteIdMapByBookId[notebookId]) {
				delete state.noteIdMapByBookId[notebookId][id]
			}

			if (state.idMap[notebookId]) {
				state.idMap[notebookId].notes = state.idMap[notebookId].notes.filter(
					noteId => id !== noteId
				)
			}
		},
		[noteRestored]: (state, { payload }) => {
			const { notebookId, id } = payload.note
			console.log(state.idMap[notebookId], state.noteIdMapByBookId[notebookId])

			// didnt belong to a notebook
			if (!notebookId) return

			if (state.idMap[notebookId]) {
				state.idMap[notebookId].notes.push(id)
			}

			if (!state.noteIdMapByBookId[notebookId]) {
				state.noteIdMapByBookId[notebookId] = {}
			}

			state.noteIdMapByBookId[notebookId][id] = true
		},
		[noteRemovedFromNotebook]: (state, { payload }) => {
			state.idMap[payload.notebookId].notes = state.idMap[payload.notebookId].notes.filter(
				id => id !== payload.noteId
			)

			delete state.noteIdMapByBookId[payload.notebookId][payload.noteId]
		}
	}
)
