import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SearchBar from './SearchBar'
import Note from './Note'

import { searchIndex } from '../../../services/search'
import { selectNote } from '../../../entities/editor/actions'
import { useParams } from 'react-router-dom'

const searchHandler = searchTerm => {
	return searchIndex.search(searchTerm, {}).sort((a, b) => b.score - a.score)
}

const notesSelector = state => ({
	ids: state.notes.ids,
	idMap: state.notes.idMap,
	notebooks: state.notebooks,
	activeNoteId: state.editor.activeNoteId
})

const notebookSelector = id => state => (!id ? undefined : state.notebooks.idMap[id])

const NotesList = () => {
	const { ids, notebooks, activeNoteId } = useSelector(notesSelector)
	const dispatch = useDispatch()
	const params = useParams()

	const notebook = useSelector(notebookSelector(params.notebookId))

	const [state, setState] = React.useState({
		searchTerm: '',
		isSearching: false,
		notes: []
	})

	React.useEffect(() => {
		if (ids.length === 0) return

		// not on a notebook so just empty the array
		// when we're not searching and we're not on a notebook, we display all notes from redux
		if (!params.notebookId) {
			if (state.isSearching) {
				const matches = searchHandler(state.searchTerm)
				return setState(prev => ({ ...prev, notes: matches.map(match => match.ref) }))
			}

			return setState(prev => ({ ...prev, notes: [] }))
		}

		const notebook = notebooks.idMap[params.notebookId]

		if (!notebook) return

		let notes = notebook.notes

		// filter notes by search term and active notebook
		if (state.isSearching && notebooks.noteIdMapByBookId[params.notebookId]) {
			const matches = searchHandler(state.searchTerm)

			let bookNotes = []

			matches.forEach(match => {
				if (notebooks.noteIdMapByBookId[params.notebookId][match.ref]) {
					bookNotes.push(match.ref)
				}
			})

			notes = bookNotes
		}

		setState(prev => ({ ...prev, notes }))
	}, [params.notebookId, notebooks, ids, state.searchTerm, state.isSearching])

	const handleNoteSelection = note => {
		dispatch(selectNote(note))
	}

	const handleSearch = async value => {
		const isSearching = value.trim().length > 0

		setState(prev => ({ ...prev, searchTerm: value, isSearching }))

		if (!isSearching) return

		const matches = searchHandler(value)

		const notebook = notebooks.idMap[params.notebookId]

		const notes = matches.reduce((acc, match) => {
			if (notebook) {
				if (notebooks.noteIdMapByBookId[params.notebookId]?.[match.ref]) {
					acc.push(match.ref)
				}
			} else {
				acc.push(match.ref)
			}

			return acc
		}, [])

		setState(prev => ({ ...prev, notes }))
	}

	const noteIds = state.isSearching || params.notebookId ? state.notes : ids
	const canDelete = (!state.isSearching && noteIds.length > 1) || !!params.notebookId

	return (
		<div>
			<div className="mb-2 px-2 w-full pb-2 pt-1">
				<SearchBar value={state.searchTerm} onSearch={handleSearch} />
			</div>

			{state.isSearching && (
				<p className="px-8 mb-2 font-semibold text-gray-700">
					Search Results ({state.notes.length})
				</p>
			)}
			{!state.isSearching && (
				<p className="px-4 mb-2 font-semibold text-gray-700">
					{notebook ? notebook.name : 'All Notes'}
				</p>
			)}

			{noteIds.map(id => {
				return (
					<Note
						canDelete={canDelete}
						key={id}
						id={id}
						isSelected={activeNoteId === id}
						onSelect={handleNoteSelection}
					/>
				)
			})}

			{notebook && noteIds.length === 0 && (
				<p className="m-4 text-center text-sm text-gray-400">This notebook is empty</p>
			)}

			<p className="m-4 text-center text-sm text-gray-400">
				<span className="font-bold">control + n</span> for a new note
			</p>
		</div>
	)
}

export default NotesList
