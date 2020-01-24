import { createAction } from '@reduxjs/toolkit'
import api from '../../api'

export const notesFetched = createAction('FETCH_NOTES_SUCCESS')

export const fetchNotes = () => {
	return async dispatch => {
		const notes = await api.notes.getAll()

		return dispatch(notesFetched({ notes }))
	}
}
