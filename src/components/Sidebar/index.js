import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { selectNote } from '../../actions/editor'

import SearchBar from './SearchBar'
import Note from './Note'
import Tag from './Tag'

const tagsSelector = state => state.tags.ids
const notesSelector = state => ({ ids: state.notes.ids, activeNoteId: state.editor.activeNoteId })

const Sidebar = () => {
	const tagIds = useSelector(tagsSelector)
	const { ids, activeNoteId } = useSelector(notesSelector)
	const dispatch = useDispatch()

	const hasNotes = ids.length > 1

	const handleNoteSelection = note => {
		dispatch(selectNote(note))
	}

	return (
		<div className="sm:w-2/6 xl:w-1/5 bg-gray-100 h-full overflow-auto flex flex-col py-2">
			{hasNotes && (
				<div className="mt-2 mb-4 px-8 w-full">
					<SearchBar />
				</div>
			)}

			<Switch>
				<Route exact path="/">
					{ids.length > 1 && <p className="px-8 my-2 font-semibold text-gray-700">All Notes</p>}

					{ids.length > 1 &&
						ids.map(id => {
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
					<p className="px-8 mt-2 mb-4 font-semibold text-gray-700">All Tags</p>

					{tagIds.map(id => {
						return (
							<Link className="px-8 py-3" key={id} to={`/tag/${id}`}>
								<Tag id={id} />
							</Link>
						)
					})}
				</Route>
			</Switch>
		</div>
	)
}

export default Sidebar
