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
			className={`cursor-pointer border-b border-gray-300 pt-3 px-4 pb-4 ${
				isSelected ? 'bg-white' : ''
			}`}
			key={note.id}
		>
			<div className="flex items-center pb-2 justify-between">
				<div className="text-gray-400 text-xl">
					<GoNote className={isSelected ? 'text-indigo-700' : ''} />
				</div>

				<p className="text-right leading-tight text-xs text-gray-400">
					{formatDistanceToNow(note.lastUpdate)} ago
				</p>
			</div>

			<p className={`ml-6 ${isSelected ? 'font-semibold' : ''}`}>
				{note.title.trim().length > 0 ? (
					note.title
				) : (
					<span className="text-gray-600 italic">Untitled Note</span>
				)}
			</p>

			<p
				className="pl-6 text-sm text-gray-500 whitespace-no-wrap overflow-hidden w-full"
				style={{ textOverflow: 'ellipsis' }}
			>
				{note.snippet.trim().length > 0 ? note.snippet : <span className="italic">empty note</span>}
			</p>
		</div>
	)
}

export default Note
