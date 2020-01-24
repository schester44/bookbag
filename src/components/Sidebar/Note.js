import React from 'react'
import { useSelector } from 'react-redux'
import { GoNote } from 'react-icons/go'
import { formatDistanceToNow } from 'date-fns'

const noteSelector = id => state => state.notes.idMap[id]

const Note = ({ id, isSelected, onSelect }) => {
	const note = useSelector(noteSelector(id))

	return (
		<div
			onClick={() => onSelect(note)}
			className={`cursor-pointer border-b border-gray-300 px-8 py-4 flex ${
				isSelected ? 'bg-white' : ''
			}`}
			key={note.id}
		>
			<div className="text-gray-400 mr-2">
				<GoNote />
			</div>
			<div className="flex-1">
				<p className={`${isSelected ? 'font-semibold' : ''} leading-none`}>
					{note.title.trim().length > 0 ? (
						note.title
					) : (
						<span className="text-gray-600 italic">Untitled Note</span>
					)}
				</p>

				<p className="text-right leading-none text-xs text-gray-400">
					{formatDistanceToNow(note.lastUpdate)} ago
				</p>
			</div>
		</div>
	)
}

export default Note
