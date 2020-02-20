import React from 'react'
import ContextMenu, { Menu, MenuItem } from '../../../../components/ContextMenu'
import { FiDelete, FiPlus } from 'react-icons/fi'
import { updateNotebook, deleteNotebook } from '../../../../entities/notebooks/actions'

import { useDispatch } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

const Book = ({ book }) => {
	const [rename, setRename] = React.useState({ visible: false, name: book.name })

	const dispatch = useDispatch()

	const handleDelete = () => {
		dispatch(deleteNotebook(book.id))
	}

	const handleRename = () => {
		setRename({ visible: true, name: book.name })
	}

	const handleNameChange = ({ target: { value } }) => setRename(prev => ({ ...prev, name: value }))

	const handleKeyPress = e => {
		if (e.key === 'Escape') {
			return setRename({ visible: false, name: book.name })
		}

		if (e.key === 'Enter') {
			setRename(prev => ({ ...prev, visible: false }))

			dispatch(
				updateNotebook({
					...book,
					name: rename.name
				})
			)
		}
	}

	if (rename.visible)
		return (
			<div>
				<input
					autoFocus
					type="text"
					value={rename.name}
					className="outline-none bg-transparent pr-4 pl-12 py-2 text-gray-400"
					onChange={handleNameChange}
					onKeyPress={handleKeyPress}
				/>
			</div>
		)

	return (
		<ContextMenu
			menu={
				<Menu>
					<MenuItem icon={<FiPlus />} onClick={handleRename}>
						Rename
					</MenuItem>

					<MenuItem icon={<FiDelete />} onClick={handleDelete}>
						Delete
					</MenuItem>
				</Menu>
			}
		>
			<NavLink
				className="navigator-link flex items-center justify-between relative"
				to={`/notebook/${book.id}`}
			>
				<span className="ml-8">{book.name}</span>
				{book.notes.length > 0 && (
					<span className="text-xs font-bold text-gray-600">{book.notes.length}</span>
				)}
			</NavLink>
		</ContextMenu>
	)
}

export default Book
