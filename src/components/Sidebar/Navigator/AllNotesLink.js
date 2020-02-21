import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosPaper } from 'react-icons/io'
import { useDrop } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { removeNoteFromNotebook } from '../../../entities/notebooks/actions'

import { ItemTypes } from '../constants'

const noteIdsSelector = state => state.notes.ids

const AllNotesLink = () => {
	const dispatch = useDispatch()
	const noteIds = useSelector(noteIdsSelector)

	const [dropProps, dropRef] = useDrop({
		accept: ItemTypes.NOTE,

		canDrop: item => !!item.note.notebookId,
		// Dropping on 'All Notebooks' deletes the notebookId from a note
		drop: ({ note }) => {
			dispatch(removeNoteFromNotebook(note))
		},
		collect: monitor => {
			return {
				isOver: monitor.isOver() && monitor.canDrop()
			}
		}
	})

	return (
		<NavLink
			ref={dropRef}
			exact
			to="/"
			className={`navigator-link flex items-center justify-between ${dropProps.isOver ? 'bg-indigo-900' : ''}`}
		>
			<div className="flex items-center">
				<IoIosPaper />
				<span className="ml-3">All Notes</span>
			</div>

			{noteIds.length > 0 && (
				<span className="text-xs font-bold text-gray-600">{noteIds.length}</span>
			)}
		</NavLink>
	)
}

export default AllNotesLink
