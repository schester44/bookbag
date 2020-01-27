import React from 'react'
import { NavLink, Switch, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GoNote } from 'react-icons/go'
import { TiArrowUnsorted } from 'react-icons/ti'
import { selectNote } from '../../actions/editor'

import SearchBar from './SearchBar'
import Note from './Note'
import Tag from './Tag'
import Folders from './Folders'

import { searchIndex } from '../../services/search'
import { debounce } from '../../utils'

const searchHandler = searchTerm => {
	return searchIndex.search(searchTerm).sort((a, b) => b.score - a.score)
}

const debouncedSearch = debounce(searchHandler, 300)

const tagsSelector = state => state.tags.ids
const notesSelector = state => ({ ids: state.notes.ids, activeNoteId: state.editor.activeNoteId })

const Sidebar = () => {
	const tagIds = useSelector(tagsSelector)
	const { ids, activeNoteId } = useSelector(notesSelector)
	const dispatch = useDispatch()

	const [state, setState] = React.useState({
		isSearching: false,
		notes: []
	})

	const hasNotes = ids.length > 1

	const handleNoteSelection = note => {
		dispatch(selectNote(note))
	}

	const handleSearch = async value => {
		const isSearching = value.trim().length > 0

		let notes = ids

		if (isSearching) {
			const matches = await debouncedSearch(value)
			notes = matches.map(match => match.ref)
		}

		setState(prev => ({ ...prev, notes, isSearching }))
	}

	const noteIds = state.isSearching ? state.notes : ids

	return (
		<div className="flex sm:w-3/6 xl:w-2/6">
			<Folders />

			<div className="w-3/5 bg-gray-100 h-full overflow-auto flex flex-col py-2">
				{hasNotes && (
					<div className="mt-2 mb-4 px-8 w-full">
						<SearchBar onSearch={handleSearch} />
					</div>
				)}

				<Switch>
					<Route exact path="/">
						{state.isSearching && (
							<p className="px-8 my-2 font-semibold text-gray-700">
								Search Results ({state.notes.length})
							</p>
						)}
						{!state.isSearching && ids.length > 1 && (
							<p className="px-4 my-2 font-semibold text-gray-700">All Notes</p>
						)}

						{noteIds.length > (state.isSearching ? 0 : 1) &&
							noteIds.map(id => {
								return (
									<Note
										key={id}
										id={id}
										isSelected={activeNoteId === id}
										onSelect={handleNoteSelection}
									/>
								)
							})}

						<p className="m-4 text-center text-sm text-gray-400">
							<span className="font-bold">control + n</span> for a new note
						</p>
					</Route>

					<Route path="/tags">
						<div>
							<p className="px-8 mt-2 mb-4 font-semibold text-gray-700">All Tags</p>
						</div>

						{tagIds.map(id => {
							return <Tag key={`t-${id}`} id={id} />
						})}
					</Route>
				</Switch>
			</div>
		</div>
	)
}

export default Sidebar
