import { createAction } from '@reduxjs/toolkit'
import api from '../../api'

import { noteSaved } from '../notes/actions'

export const booksFetched = createAction('NOTEBOOKS_FETCHED')
export const bookCreated = createAction('NOTEBOOK_CREATED')
export const bookUpdated = createAction('NOTEBOOK_UPDATED')
export const bookDeleted = createAction('NOTEBOOK_DELETED')
export const noteRemovedFromNotebook = createAction('NOTE_REMOVED_FROM_NOTEBOOK')

export const fetchNotebooks = () => {
	return async dispatch => {
		const notebooks = await api.notebooks.getAll()

		dispatch(booksFetched({ notebooks }))

		return notebooks
	}
}

export const removeNoteFromNotebook = ({ id, notebookId }) => {
	return (dispatch, getState) => {
		const state = getState()
		const note = state.notes.idMap[id]
		const notebook = state.notebooks.idMap[notebookId]

		Promise.all([
			api.notebooks.save(notebookId, {
				...notebook,
				notes: notebook.notes.filter(noteId => noteId !== id)
			}),
			api.notes.save(id, {
				...note,
				notebookId: undefined
			})
		]).then(() => {
			dispatch(noteRemovedFromNotebook({ noteId: id, notebookId }))
		})
	}
}

export const addNoteToNotebook = (bookId, note) => {
	return async (dispatch, getState) => {
		const state = getState()
		const book = state.notebooks.idMap[bookId]

		// Need to call this one first. Putting it inside the array of promises causes a race condition when moving the note from one book to another when using IndexedDB

		await api.notebooks.save(bookId, {
			...book,
			notes: book.notes.concat(note.id)
		})

		const promises = [
			api.notes.save(note.id, {
				...note,
				notebookId: bookId
			})
		]

		let originalNotebookId = note.notebookId

		// It belongs to a notebook, so we need to remove it from that notebook
		if (note.notebookId && state.notebooks.idMap[note.notebookId]) {
			const originalBook = state.notebooks.idMap[note.notebookId]

			if (originalBook) {
				promises.push(
					api.notebooks.save(originalBook.id, {
						...originalBook,
						notes: originalBook.notes.filter(id => id !== note.id)
					})
				)
			}
		}

		// TODO: this API method could be something specific to updating/adding a note to a book
		Promise.all(promises).then(() => {
			dispatch(
				noteSaved({
					originalNotebookId,
					note: {
						...note,
						notebookId: bookId
					}
				})
			)
		})
	}
}

export const createNotebook = input => {
	return dispatch => {
		return api.notebooks.save(null, { notes: [], ...input }).then(notebook => {
			dispatch(bookCreated({ notebook }))
			return notebook
		})
	}
}

export const updateNotebook = notebook => {
	return dispatch => {
		return api.notebooks.save(notebook.id, notebook).then(notebook => {
			dispatch(bookUpdated({ notebook }))
			return notebook
		})
	}
}

export const deleteNotebook = id => {
	return dispatch => {
		api.notebooks.delete(id)
		dispatch(bookDeleted({ id }))
	}
}
