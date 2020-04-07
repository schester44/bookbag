import React from 'react'
import { FiDelete, FiPlus } from 'react-icons/fi'
import { useMutation } from '@apollo/client'
import { NavLink, useParams, useHistory } from 'react-router-dom'
import { useDrop } from 'react-dnd'

import ContextMenu, { Menu, MenuItem } from 'components/ContextMenu'
import { deleteNoteBookMutation, updateNoteBookMutation } from 'mutations'
import { ItemTypes } from '../../constants'
import produce from 'immer'
import { bookbagQuery } from 'queries'

const Book = ({ book }) => {
	const { notebookId } = useParams()
	const history = useHistory()
	const [deleteNoteBook] = useMutation(deleteNoteBookMutation)
	const [updateNoteBook] = useMutation(updateNoteBookMutation)

	const [rename, setRename] = React.useState({ visible: false, name: book.name })

	const totalNotes = React.useMemo(() => {
		return book.notes.filter((note) => !note.trashed).length
	}, [book.notes])

	const [dropProps, dropRef] = useDrop({
		accept: ItemTypes.NOTE,

		canDrop: (item) => {
			return item.note.notebookId !== book.id
		},
		drop: ({ note }) => {
			// TODO: Add this note to the notebook
			// dispatch(addNoteToNotebook(book.id, note))
		},
		collect: (monitor) => {
			return {
				isOver: monitor.isOver() && monitor.canDrop(),
			}
		},
	})

	const handleDelete = () => {
		deleteNoteBook({
			variables: {
				id: book.id,
			},
			optimisticResponse: {
				__typename: 'Mutation',
				deleteNoteBook: true,
			},
			update: (client) => {
				const data = client.readQuery({
					query: bookbagQuery,
				})

				client.writeQuery({
					query: bookbagQuery,
					data: produce(data, (draft) => {
						draft.notebooks = draft.notebooks.filter(({ id }) => id !== book.id)
					}),
				})
			},
		})

		if (notebookId === book.id) {
			history.push('/')
		}
	}

	const handleRename = () => {
		setRename({ visible: true, name: book.name })
	}

	const handleNameChange = ({ target: { value } }) =>
		setRename((prev) => ({ ...prev, name: value }))

	const handleKeyPress = (e) => {
		if (e.key === 'Escape') {
			return setRename({ visible: false, name: book.name })
		}

		if (e.key === 'Enter') {
			setRename((prev) => ({ ...prev, visible: false }))

			updateNoteBook({
				optimisticResponse: {
					__typename: 'Mutation',
					updateNoteBook: {
						name: rename.name,
						__typename: 'NoteBook',
					},
				},
				variables: {
					id: book.id,
					name: rename.name,
				},
			})
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
				ref={dropRef}
				className={`navigator-link flex items-center justify-between ${
					dropProps.isOver ? 'bg-indigo-900' : ''
				}`}
				to={`/notebook/${book.id}`}
			>
				<div className="ml-8 flex-1 truncate">{rename.name}</div>
				{totalNotes > 0 && (
					<span className="text-xs font-bold ml-1 text-gray-600">{totalNotes}</span>
				)}
			</NavLink>
		</ContextMenu>
	)
}

export default Book
