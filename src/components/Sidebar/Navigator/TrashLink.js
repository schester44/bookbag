import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useDrop } from 'react-dnd'
import { FiDelete } from 'react-icons/fi'

import { ItemTypes } from '../constants'

import { sendToTrash } from '../../../entities/trash/actions'

const trashSelector = state => state.trash.ids

const TrashLink = () => {
	const trashIds = useSelector(trashSelector)

	const dispatch = useDispatch()
	const [dropProps, dropRef] = useDrop({
		accept: ItemTypes.NOTE,
		drop: ({ note }) => {
			dispatch(sendToTrash({ noteId: note.id }))
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
			to="/trash"
			className={`navigator-link flex items-center justify-between ${
				dropProps.isOver ? 'bg-indigo-900' : ''
			}`}
		>
			<div className="flex items-center">
				<FiDelete />
				<span className="ml-3">Trash</span>
      </div>
      
      
			{trashIds.length > 0 && (
				<span className="text-xs font-bold text-gray-600">{trashIds.length}</span>
			)}
		</NavLink>
	)
}

export default TrashLink
