import { createAction } from '@reduxjs/toolkit'

import api from '../../api'
import { history } from '../../utils'

import { createSearchIndex, createTagSearchIndex } from '../../services/search'
import { fetchNoteTags } from '../tags/actions'
import { createNewNote } from '../notes/actions'

export const paneShown = createAction('BOOKBAG_PANE_SHOWN')
export const paneHidden = createAction('BOOKBAG_PANE_HIDDEN')

export const bookBagInitialized = createAction('BOOKBAG_INITIALIZED')

// this gets called on initial page load and everytime the noteId changes.
// We only want to make API calls once though so we return early if its already been loaded.
// isLoaded gets set to true inside of entities/bookbag/reducer (bookBagInitialized)
// FIXME: This shouldn't need to be called everytime we click a notebook or note
export const initBookBag = ({ noteId }) => {
	return async (dispatch, getState) => {
		const { bookbag } = getState()

		// if there is a noteId, lets update what the last opened note was.
		// We use the lastOpened ID to restore the previous session when loading the page
		if (noteId) {
			api.notes.lastOpened.save(noteId)
		}

		if (bookbag.isLoaded) {
			return
		}

		const promises = [
			api.notebooks.getAll(),
			api.notes.getAll(),
			api.tags.getAll(),
			api.trash.getAll(),
			api.tags.getNoteTags(),
			api.notes.lastOpened.get()
		]

		Promise.all(promises).then(async ([notebooks, notes, tags, trash, noteTags, lastOpenedId]) => {
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
					noteTags,
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
