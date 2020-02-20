import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SearchBar from './SearchBar'
import Note from './Note'

import { searchIndex } from '../../../services/search'
import { debounce } from '../../../utils'
import { selectNote } from '../../../entities/editor/actions'
import { useParams } from 'react-router-dom'

const searchHandler = searchTerm => {
	return searchIndex.search(searchTerm).sort((a, b) => b.score - a.score)
}

const debouncedSearch = debounce(searchHandler, 300)

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

		if (!params.notebookId) {
			setState(prev => ({ ...prev, notes: [] }))
		}

		const notebook = notebooks.idMap[params.notebookId]

		if (!notebook) return

		setState(prev => ({ ...prev, notes: notebook.notes }))
	}, [params.notebookId, notebooks, ids])

	const hasNotes = ids.length > 1

	const handleNoteSelection = note => {
		dispatch(selectNote(note))
	}

	const handleSearch = async value => {
		const isSearching = value.trim().length > 0

		setState(prev => ({ ...prev, searchTerm: value, isSearching }))

		if (isSearching) {
			const matches = await debouncedSearch(value)
			setState(prev => ({ ...prev, notes: matches.map(match => match.ref) }))
		}
	}

	const noteIds = state.isSearching || params.notebookId ? state.notes : ids

	return (
		<div>
			{hasNotes && (
				<div className="mb-2 px-2 w-full pb-2 pt-1">
					<SearchBar value={state.searchTerm} onSearch={handleSearch} />
				</div>
			)}

			{state.isSearching && (
				<p className="px-8 mb-2 font-semibold text-gray-700">
					Search Results ({state.notes.length})
				</p>
			)}
			{!state.isSearching && ids.length > 1 && (
				<p className="px-4 mb-2 font-semibold text-gray-700">
					{notebook ? notebook.name : 'All Notes'}
				</p>
			)}

			{noteIds.map(id => {
				return (
					<Note key={id} id={id} isSelected={activeNoteId === id} onSelect={handleNoteSelection} />
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
