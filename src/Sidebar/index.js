import React from 'react'
import { GoNote } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { FiHash } from 'react-icons/fi'

const Searchbar = ({ value, onSearch }) => {
	return (
		<input
			className="w-full px-2 py-1 outline-none text-gray-600 bg-gray-300 rounded-full"
			type="text"
			placeholder="Search..."
			// value={value}
			// onChange={({ target: { value } }) => onSearch(value)}
		/>
	)
}

const tagsSelector = state => state.tags

const Sidebar = ({ activeNote, notesById, noteIds, onNoteSelect }) => {
	const hasNotes = noteIds.length > 0
	const tags = useSelector(tagsSelector)

	return (
		<div className="w-1/5 bg-gray-100 h-full overflow-auto flex flex-col py-2">
			{hasNotes && (
				<div className="mt-2 mb-4 px-8 w-full">
					<Searchbar />
				</div>
			)}

			<p className="px-8 my-2 font-semibold text-gray-700">All Notes</p>

			{noteIds.map(id => {
				const note = notesById[id]

				return (
					<div
						onClick={() => onNoteSelect(note)}
						className={`cursor-pointer border-b border-gray-300 px-8 py-4 flex ${
							activeNote.id === note.id ? 'bg-white font-bold' : ''
						}`}
						key={note.id}
					>
						<div className="text-gray-400 mr-2">
							<GoNote />
						</div>
						<div className="flex flex-1 justify-between items-center">
							<p className="leading-none">
								{note.title || <span className="text-gray-600 italic">Untitled Note</span>}
							</p>

							<p className="leading-none text-xs text-gray-400">
								{formatDistanceToNow(note.lastUpdate)} ago
							</p>
						</div>
					</div>
				)
			})}

			<p className="m-4 text-center text-sm text-gray-400">
				<span className="font-bold">control + n</span> for a new note
			</p>

			<p className="px-8 mb-4 font-semibold text-gray-700">All Tags</p>

			{tags.ids.map(id => {
				const tag = tags.idMap[id]

				return (
					<Link className="px-8 py-3" key={id} to={`/tag/${id}`}>
						<div className={`flex`}>
							<div className="text-gray-400 mr-2">
								<FiHash />
							</div>
							<div className="cursor-pointer">
								<p className="leading-none">
									{tag.name || <span className="text-gray-600 italic">Untitled Tag</span>}
								</p>
							</div>
						</div>
					</Link>
				)
			})}
		</div>
	)
}

export default Sidebar
