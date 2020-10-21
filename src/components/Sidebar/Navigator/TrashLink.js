import React from 'react'
import { NavLink } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useDrop } from 'react-dnd'
import { FiDelete } from 'react-icons/fi'

import { ItemTypes } from '../constants'
import { updateNoteMutation } from 'mutations'

const TrashLink = ({ totalNotes }) => {
	const [updateNote] = useMutation(updateNoteMutation)

	const [dropProps, dropRef] = useDrop({
		accept: ItemTypes.NOTE,
		drop: ({ note }) => {
			updateNote({
				variables: {
					id: note.id,
					input: {
						trashed: true,
					},
				},
			})
		},
		collect: (monitor) => {
			return {
				isOver: monitor.isOver() && monitor.canDrop(),
			}
		},
	})

	return (
		<NavLink
			ref={dropRef}
			to="/trash"
			className={`navigator-link flex items-center justify-between ${
				dropProps.isOver ? 'bg-indigo-900' : ''
			}`}
		>
			<div className="flex items-center">
				<FiDelete />
				<span className="ml-2 text-sm font-bold">Trash</span>
			</div>

			{totalNotes > 0 && <span className="text-xs font-bold text-gray-600">{totalNotes}</span>}
		</NavLink>
	)
}

export default TrashLink
