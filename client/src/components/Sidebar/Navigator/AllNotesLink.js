import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosPaper } from 'react-icons/io'
import { useDrop } from 'react-dnd'

import { ItemTypes } from '../constants'

const AllNotesLink = ({ totalNotes }) => {
	const [dropProps, dropRef] = useDrop({
		accept: ItemTypes.NOTE,

		canDrop: (item) => !!item.note.notebookId,
		// Dropping on 'All Notebooks' deletes the notebookId from a note
		drop: ({ note }) => {

			console.log(note);
			// TODO: Remove the note from the notebook
			// dispatch(removeNoteFromNotebook(note))
		},
		collect: (monitor) => {
			return {
				isOver: monitor.isOver() && monitor.canDrop(),
			}
		},
	})

	return (
		<NavLink
			exact
			ref={dropRef}
			to="/"
			className={`navigator-link flex items-center justify-between ${
				dropProps.isOver ? 'bg-indigo-900' : ''
			}`}
		>
			<div className="flex items-center">
				<IoIosPaper /><span className="ml-2 text-sm font-bold">All Notes</span>
			</div>

			{totalNotes > 0 && <span className="text-xs font-bold text-gray-600">{totalNotes}</span>}
		</NavLink>
	)
}

export default AllNotesLink
