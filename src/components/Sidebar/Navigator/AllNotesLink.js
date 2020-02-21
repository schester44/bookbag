import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosPaper } from 'react-icons/io'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { removeNoteFromNotebook } from '../../../entities/notebooks/actions'

import { ItemTypes } from '../constants'

const AllNotesLink = () => {
	const dispatch = useDispatch()
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
			className={`navigator-link ${dropProps.isOver ? 'bg-indigo-900' : ''}`}
		>
			<IoIosPaper />
			<span className="ml-3">All Notes</span>
		</NavLink>
	)
}

export default AllNotesLink
