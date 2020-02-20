import { createAction } from '@reduxjs/toolkit'

import api from '../../api'
import { createNewNote } from '../notes/actions'

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
		const { editor, notes } = getState()

		const note = { ...notes.idMap[noteId] }

		const trashedAt = new Date()

		api.notes.sendToTrash({ note, trashedAt }).then(note => {
			let activeNoteId
			let newNote

			if (editor.activeNoteId === note.id) {
				activeNoteId = notes.ids.find(id => id !== note.id)
			}

			if (notes.ids.length === 1) {
				newNote = createNewNote()
				activeNoteId = newNote.id
			}

			dispatch(noteTrashed({ note, trashedAt, activeNoteId, newNote }))
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
	return dispatch => {
		api.trash.restore({ noteId }).then(note => {
			dispatch(noteRestored({ note }))
		})
	}
}
