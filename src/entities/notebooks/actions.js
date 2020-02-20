import { createAction } from '@reduxjs/toolkit'

import api from '../../api'

export const booksFetched = createAction('NOTEBOOKS_FETCHED')
export const bookCreated = createAction('NOTEBOOK_CREATED')
export const bookUpdated = createAction('NOTEBOOK_UPDATED')
export const bookDeleted = createAction('NOTEBOOK_DELETED')

export const fetchNotebooks = () => {
	return async dispatch => {
		const notebooks = await api.notebooks.getAll()

		dispatch(booksFetched({ notebooks }))

		return notebooks
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
