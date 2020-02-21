import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoNote } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useDrag } from 'react-dnd'

import { sendToTrash } from '../../../entities/trash/actions'
import { ItemTypes } from '../constants'
import { deleteNote } from '../../../entities/notes/actions'

const noteSelector = id => state => state.notes.idMap[id]
const bookSelector = id => state => state.notebooks.idMap[id]

const Note = ({ id, isSelected, canDelete = true, onSelect }) => {
	const note = useSelector(noteSelector(id))
	const book = useSelector(bookSelector(note.notebookId))
	const dispatch = useDispatch()

	const [{ isDragging }, dragRef] = useDrag({
		item: { type: ItemTypes.NOTE, note },
		collect: monitor => ({
			isDragging: monitor.isDragging()
		})
	})

	if (!note) return null

	const handleDelete = () => {
		// just delete any empty notes, dont send them to the trash
		if (note.snippet.trim().length === 0 && note.title.trim().length === 0) {
			return dispatch(deleteNote(note.id))
		}

		dispatch(sendToTrash({ noteId: id }))
	}

	return (
		<div
			ref={dragRef}
			style={{ opacity: isDragging ? 0.2 : 1 }}
			onClick={() => onSelect(note)}
			className={`sidebar-note cursor-pointer border-b border-gray-300 pt-3 px-4 pb-4 ${
				isSelected ? 'bg-white' : ''
			} ${isDragging ? 'text-white bg-indigo-900' : ''}`}
		>
			<div className="flex items-center pb-2 justify-between">
				<div className="text-gray-400 text-xl flex items-center">
					<GoNote className={isSelected ? 'text-indigo-700' : ''} />

					{book && <span className="pl-2 text-xs">{book.name}</span>}
				</div>

				<div className="flex items-center">
					<p className="text-right leading-none text-xs text-gray-400">
						{formatDistanceToNow(note.lastUpdate)} ago
					</p>

					{canDelete && (
						<div
							className="text-gray-400 pl-2 text-xs hover:text-gray-900 opacity-0 delete-btn"
							onClick={handleDelete}
						>
							<FiTrash2 />
						</div>
					)}
				</div>
			</div>

			<p
				className={`ml-6 ${isSelected ? 'font-semibold' : ''}`}
				style={{
					overflow: 'hidden',
					display: '-webkit-box',
					WebkitLineClamp: 3,
					WebkitBoxOrient: 'vertical'
				}}
			>
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
				{note.snippet?.trim().length > 0 ? (
					note.snippet
				) : (
					<span className="italic">empty note</span>
				)}
			</p>
		</div>
	)
}

export default Note