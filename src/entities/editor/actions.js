import { createAction } from '@reduxjs/toolkit'
import api from '../../api'

import { fetchNoteTags } from '../tags/actions'

export const activeNoteChanged = createAction('ACTIVE_NOTE_CHANGED')

export const selectNote = note => {
	return dispatch => {
		dispatch(fetchNoteTags(note.id))

		api.notes.lastOpened.save(note.id)
		dispatch(activeNoteChanged({ noteId: note.id }))
	}
}
