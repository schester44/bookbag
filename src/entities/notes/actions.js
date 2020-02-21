import { createAction } from '@reduxjs/toolkit'
import nanoid from 'nanoid'
import debounce from 'lodash/debounce'

import { serializeToText } from '../../components/EditorWindow/utils'
import api from '../../api'
import { fetchNoteTags } from '../tags/actions'
import { removeNoteFromNotebook } from '../notebooks/actions'

export const notesFetched = createAction('FETCH_NOTES_SUCCESS')
export const noteCreated = createAction('NOTE_CREATED')
export const noteDeleted = createAction('NOTE_DELETED')
export const notesInitialized = createAction('NOTES_INITIALIZED')
export const noteSaved = createAction('NOTE_SAVED')

export const fetchNotes = () => {
	return async dispatch => {
		const notes = await api.notes.getAll()

		dispatch(notesFetched({ notes }))

		return notes
	}
}

export const initNotes = () => {
	return dispatch => {
		return Promise.all([dispatch(fetchNotes()), api.notes.lastOpened.get()]).then(
			async ([{ ids, idMap }, lastOpenedId]) => {
				const idOfNote = lastOpenedId || ids[0]

				if (idOfNote) {
					dispatch(fetchNoteTags(idOfNote))
				}

				const isNewNote = !idMap[lastOpenedId] && !idMap[ids[0]]

				dispatch(
					notesInitialized({
						isNewNote,
						activeNote: idMap[lastOpenedId] || idMap[ids[0]] || createNewNote()
					})
				)

				return { idMap, ids }
			}
		)
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
		const { editor, notes } = getState()

		const note = notes.idMap[noteId]

		api.notes.delete(noteId)

		let activeNoteId

		console.log(note);

		if (note.notebookId) {
			dispatch(removeNoteFromNotebook(note))
		}

		if (editor.activeNoteId === noteId) {
			activeNoteId = notes.ids.find(id => id !== noteId)
		}

		dispatch(noteDeleted({ noteId, activeNoteId }))
	}
}

export const openNewNote = ({ notebookId } = {}) => {
	return dispatch => {
		const note = createNewNote({ notebookId })

		dispatch(noteCreated({ note }))

		return note
	}
}
