import React from 'react'
import { GoNote } from 'react-icons/go'

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

const Sidebar = ({ notesById, noteIds, onNoteSelect }) => {
	const hasNotes = noteIds.length > 0

	return (
		<div className="w-64 bg-gray-200 h-full flex flex-col p-2 border-r border-gray-200">
			<div className="flex-1 overflow-auto">
				{!hasNotes && <p className="italic text-gray-500">no saved notes</p>}

				{hasNotes && (
					<div className="my-2 w-full">
						<Searchbar />
					</div>
				)}

				{noteIds.map(id => {
					const note = notesById[id]

					return (
						<div onClick={() => onNoteSelect(note)} className="px-2 py-2 flex" key={note.id}>
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

				<p className="mt-4 text-center text-sm text-gray-400">
					<span className="font-bold">control + n</span> for a new note
				</p>
			</div>
		</div>
	)
}

export default Sidebar
