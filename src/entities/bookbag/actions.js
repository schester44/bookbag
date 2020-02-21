import { createAction } from '@reduxjs/toolkit'

import api from '../../api'
import { history } from '../../utils'

import { createSearchIndex, createTagSearchIndex } from '../../services/search'
import { fetchNoteTags } from '../tags/actions'
import { createNewNote } from '../notes/actions'

export const bookBagInitialized = createAction('BOOKBAG_INITIALIZED')

// this gets called on initial page load and everytime the noteId changes.
// We only want to make API calls once though so we return early if its already been loaded.
// isLoaded gets set to true inside of entities/bookbag/reducer (bookBagInitialized)
// FIXME: This shouldn't need to be called everytime we click a notebook or note
export const initBookBag = ({ notebookId, noteId }) => {
	return async (dispatch, getState) => {
		const { bookbag, notes } = getState()

		// if there is a noteId, lets update what the last opened note was.
		// We use the lastOpened ID to restore the previous session when loading the page
		if (noteId) {
			api.notes.lastOpened.save(noteId)
		}

		if (bookbag.isLoaded) {
			// if there's no noteId then the user landed on the home page without a note.. lets get the last note

			// if (!noteId && !notebookId) {
			// 	const lastOpenedId = await api.notes.lastOpened.get()
			// 	const activeNote = notes.idMap[lastOpenedId] || notes.idMap[notes.ids[0]]

			// 	console.log('here')
			// 	if (activeNote) {
			// 		history.push(`/note/${activeNote.id}`)
			// 	} else {
			// 		// TODO: handle this state
			// 	}
			// }

			// no need to go any futher call the APIs if its already been loaded
			return
		}

		const promises = [
			api.notebooks.getAll(),
			api.notes.getAll(),
			api.tags.getAll(),
			api.trash.getAll(),
			api.notes.lastOpened.get()
		]

		Promise.all(promises).then(async ([notebooks, notes, tags, trash, lastOpenedId]) => {
			createSearchIndex({ notes: notes.ids.map(id => notes.idMap[id]) })
			createTagSearchIndex({ tags: tags.ids.map(id => tags.idMap[id]) })

			// Create a new 'activeNote' if the current one does not exist.. We'll insert this note into redux but not save it --- until the user interacts with it. This ensures the Editor always has a note to display
			const activeNote =
				notes.idMap[noteId] ||
				notes.idMap[lastOpenedId] ||
				notes.idMap[notes.ids[0]] ||
				createNewNote()

			// The note with the noteId provided in the URL does not exist, so redirect to the next best thing (the activeNote)
			if ((noteId && !notes.idMap[noteId]) || history.location.pathname === '/') {
				history.push(`/note/${activeNote.id}`)
			}

			// If either of these are true then it _Shouldnt_ be a new note
			const isNewNote = activeNote.title.length === 0 && activeNote.snippet.length === 0

			if (!isNewNote) {
				dispatch(fetchNoteTags(activeNote.id))
			}

			dispatch(
				bookBagInitialized({
					notebooks,
					notes,
					tags,
					trash,
					lastOpenedId,
					activeNote: {
						isNewNote,
						id: activeNote.id,
						note: activeNote
					}
				})
			)
		})
	}
}
