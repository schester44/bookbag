import { createReducer } from '@reduxjs/toolkit'

import { activeNoteChanged } from '../editor/actions'
import { noteCreated, notesInitialized } from '../notes/actions'
import { noteTrashed } from '../trash/actions'

export default createReducer(
	{ activeNoteId: undefined },
	{
		[activeNoteChanged]: (state, { payload }) => {
			state.activeNoteId = payload.noteId
		},
		[notesInitialized]: (state, { payload }) => {
			state.activeNoteId = payload.activeNote.id
		},
		[noteCreated]: (state, { payload }) => {
			state.activeNoteId = payload.note.id
		},
		[noteTrashed]: (state, { payload }) => {
			if (payload.activeNoteId && payload.activeNoteId !== state.activeNoteId) {
				state.activeNoteId = payload.activeNoteId
			}
		}
	}
)
