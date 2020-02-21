import React from 'react'
import { FiList, FiTrash, FiCheckSquare, FiPlus } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteRight } from 'react-icons/fa'

import BlockButton from './BlockButton'
import { useDispatch, useSelector } from 'react-redux'

import { sendToTrash } from '../../entities/trash/actions'
import { openNewNote } from '../../entities/notes/actions'
import { removeFromSearchIndex } from '../../services/search'
import { useParams, useHistory } from 'react-router-dom'

const canSendToTrashSelector = state => state.notes.ids.length > 1

const EditorToolbar = ({ activeNote }) => {
	const dispatch = useDispatch()
	const { notebookId } = useParams()
	const history = useHistory()
	const canSendToTrash = useSelector(canSendToTrashSelector)

	const handleDelete = () => {
		removeFromSearchIndex(activeNote)

		dispatch(sendToTrash({ noteId: activeNote.id }))
	}

	const handleNew = () => {
		const note = dispatch(openNewNote({ notebookId }))

		const pathname = notebookId ? `/notebook/${notebookId}/${note.id}` : `/note/${note.id}`

		history.push({
			pathname,
			from: history.location
		})
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
				{canSendToTrash && (
					<div className="toolbar-btn" onClick={handleDelete}>
						<FiTrash />
					</div>
				)}

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
