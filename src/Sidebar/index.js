import React from 'react'
import { GoNote } from 'react-icons/go'

const index = ({ notes, onNoteSelect }) => {
	return (
		<div className="w-64 h-full flex flex-col p-2 border-r border-gray-200">
			<h1 className="font-black text-xl mb-2 text-indigo-700">Notes</h1>

			<div className="flex-1 overflow-auto">
				{notes.length === 0 && <p className="italic text-gray-500">no saved notes</p>}

				{notes.map(note => {
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
			</div>
		</div>
	)
}

export default index
