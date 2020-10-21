import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GoNote } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../constants'

import { notebookQuery } from 'queries'
import { updateNoteMutation, deleteNoteMutation } from 'mutations'
import useDeleteNote from 'hooks/useDeleteNote'
import { useParams } from 'react-router'

const Note = ({ note, isSelected, onSelect }) => {
	const { notebookId } = useParams()

	const [updateNote] = useMutation(updateNoteMutation)
	const [deleteNote] = useDeleteNote({ id: note.id, notebookId })

	useMutation(deleteNoteMutation, {
		variables: { id: note.id },
	})

	const { data } = useQuery(notebookQuery, {
		skip: !note.notebookId,
		variables: { id: note.notebookId },
	})

	const book = data?.notebook

	const [{ isDragging }, dragRef] = useDrag({
		item: { type: ItemTypes.NOTE, note },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	if (!note) return null

	const handleDelete = (e) => {
		e.stopPropagation()

		// just delete any empty notes, dont send them to the trash
		if (note.snippet.trim().length === 0 && note.title.trim().length === 0) {
			deleteNote()
		} else {
			updateNote({
				variables: {
					id: note.id,
					input: {
						trashed: true,
					},
				},
			})
		}
	}

	if (note.trashed) return null

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
						{formatDistanceToNow(new Date(note.updatedAt))} ago
					</p>

					<div
						className="text-gray-400 pl-2 text-xs hover:text-gray-900 opacity-0 delete-btn"
						onClick={handleDelete}
					>
						<FiTrash2 />
					</div>
				</div>
			</div>

			<p
				className={`ml-6 ${isSelected ? 'font-semibold' : ''}`}
				style={{
					overflow: 'hidden',
					display: '-webkit-box',
					WebkitLineClamp: 3,
					WebkitBoxOrient: 'vertical',
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
