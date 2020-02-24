import { createAction } from '@reduxjs/toolkit'
import nanoid from 'nanoid'
import debounce from 'lodash/debounce'

import api from '../../api'
import { serializeToText } from '../../components/EditorWindow/utils'

import { removeNoteFromNotebook } from '../notebooks/actions'

export const notesFetched = createAction('FETCH_NOTES_SUCCESS')
export const noteCreated = createAction('NOTE_CREATED')
export const noteDeleted = createAction('NOTE_DELETED')
export const noteSaved = createAction('NOTE_SAVED')

export const fetchNotes = () => {
	return async dispatch => {
		const notes = await api.notes.getAll()

		dispatch(notesFetched({ notes }))

		return notes
	}
}

export const debouncedSaveNote = debounce(({ note }, dispatch) => {
	dispatch(saveNote({ note }))
}, 150)

export const saveNote = ({ note }) => {
	return async dispatch => {
		let snippet = note.snippet

		if (!snippet || snippet.length < 50) {
			snippet = serializeToText(note.body).slice(0, 150)
		}

		const savedNote = await api.notes.save(note.id, { ...note, snippet })

		dispatch(noteSaved({ note: savedNote }))
	}
}

export const createNewNote = ({ notebookId } = {}) => {
	return {
		id: nanoid(),
		title: '',
		snippet: '',
		lastUpdate: new Date(),
		notebookId,
		body: [
			{
				type: 'paragraph',
				children: [{ text: '' }]
			}
		]
	}
}

export const deleteNote = noteId => {
	return (dispatch, getState) => {
		const { notes } = getState()

		const note = notes.idMap[noteId]

		return api.notes.delete(noteId).then(() => {
			if (note?.notebookId) {
				dispatch(removeNoteFromNotebook(note))
			}

			dispatch(noteDeleted({ noteId }))

			return true
		})
	}
}

export const openNewNote = ({ notebookId } = {}) => {
	return dispatch => {
		const note = createNewNote({ notebookId })

		dispatch(noteCreated({ note }))

		return note
	}
}
