import React from 'react'
import { FiList, FiTrash, FiCheckSquare, FiPlus } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteRight } from 'react-icons/fa'

import BlockButton from './BlockButton'
import { useDispatch } from 'react-redux'

import { sendToTrash } from '../../entities/trash/actions'
import { openNewNote } from '../../entities/notes/actions'
import { removeFromSearchIndex } from '../../services/search'
import { useParams } from 'react-router-dom'

const EditorToolbar = ({ activeNote }) => {
	const dispatch = useDispatch()
	const { notebookId } = useParams()

	const handleDelete = () => {
		removeFromSearchIndex(activeNote)

		dispatch(sendToTrash({ noteId: activeNote.id }))
	}

	const handleNew = () => {
		dispatch(openNewNote({ notebookId }))
	}

	return (
		<div className="flex justify-between items-center w-full">
			<div className="flex">
				<BlockButton format="block-quote" icon={<FaQuoteRight />} />
				<BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
				<BlockButton format="bulleted-list" icon={<FiList />} />
				<BlockButton format="todo-item" icon={<FiCheckSquare />} />
			</div>

			<div className="settings flex items-center">
				<div className="toolbar-btn" onClick={handleDelete}>
					<FiTrash />
				</div>

				<div
					onClick={handleNew}
					className="flex items-center ml-2 rounded bg-gray-800 py-1 px-2 text-gray-100 text-xs font-bold cursor-pointer hover:bg-gray-900"
				>
					<FiPlus className="mr-1" /> New Note
				</div>
			</div>
		</div>
	)
}

export default EditorToolbar