import React from 'react'
import { GoNote } from 'react-icons/go'
import { FaHashtag } from 'react-icons/fa'

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

const Sidebar = ({
	activeNote,
	notesById,
	noteIds,
	tagIds,
	tagsById,
	onTagSelect,
	onNoteSelect
}) => {
	const hasNotes = noteIds.length > 0

	return (
		<div className="w-64 bg-gray-200 h-full flex flex-col p-2 border-r border-gray-200">
			<div className="flex-1 overflow-auto">
				{hasNotes && (
					<div className="mt-2 mb-4 w-full">
						<Searchbar />
					</div>
				)}

				<p className="px-1 font-semibold text-gray-700">All Notes</p>

				{noteIds.map(id => {
					const note = notesById[id]

					return (
						<div
							onClick={() => onNoteSelect(note)}
							className={`px-2 py-2 flex ${activeNote.id === note.id ? 'font-bold' : ''}`}
							key={note.id}
						>
							<div className="text-gray-400 mr-2">
								<GoNote />
							</div>
							<div className="cursor-pointer">
								<p className="leading-none">
									{note.title || <span className="text-gray-600 italic">Untitled Note</span>}
								</p>
							</div>
						</div>
					)
				})}

				<p className="font-semibold mt-2 text-gray-700">All Tags</p>

				{tagIds.map(id => {
					const tag = tagsById[id]

					return (
						<div onClick={() => onTagSelect(tag)} className={`px-2 py-2 flex`} key={tag.id}>
							<div className="text-gray-400 mr-2">
								<FaHashtag />
							</div>
							<div className="cursor-pointer">
								<p className="leading-none">
									{tag.name || <span className="text-gray-600 italic">Untitled Tag</span>}
								</p>
							</div>
						</div>
					)
				})}

				<p className="mt-4 text-center text-sm text-gray-400">
					<span className="font-bold">control + n</span> for a new note
				</p>
			</div>
		</div>
	)
}

export default Sidebar
