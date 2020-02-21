import { createAction } from '@reduxjs/toolkit'

import { history } from '../../utils'
import api from '../../api'
import { removeNoteFromNotebook } from '../notebooks/actions'

export const trashFetched = createAction('TRASH_FETCHED')
export const noteRestored = createAction('TRASH_NOTE_RESTORED')
export const noteTrashed = createAction('NOTE_TRASHED')
export const noteDeleted = createAction('NOTE_DELETED')

export const fetchTrash = () => {
	return async dispatch => {
		const trash = await api.trash.getAll()
		dispatch(trashFetched({ trash }))
		return trash
	}
}

export const sendToTrash = ({ noteId }) => {
	return (dispatch, getState) => {
		const { notes } = getState()

		const note = { ...notes.idMap[noteId] }

		const trashedAt = new Date()

		if (note.notebookId) {
			dispatch(removeNoteFromNotebook(note))
		}

		// We're deleting the activeNote by the location's pathname
		// TODO: This could be better.
		if (history.location.pathname.includes(noteId)) {
			const nextNote = notes.ids.find(id => id !== noteId)
			
			if (nextNote) {
				history.push(`/note/${nextNote}`, {
					from: history.location.state?.from
				})
			}
		}

		api.notes.sendToTrash({ note, trashedAt }).then(note => {
			dispatch(noteTrashed({ note, trashedAt }))

			return true
		})
	}
}

export const deleteTrashedNote = ({ noteId }) => {
	return dispatch => {
		api.trash.deleteNote({ noteId })
		dispatch(noteDeleted({ noteId }))
	}
}

export const restoreFromTrash = ({ noteId }) => {
	// TODO: Add the note back to the notebook storage & redux
	return dispatch => {
		api.trash.restore({ noteId }).then(note => {
			dispatch(noteRestored({ note }))
		})
	}
}
