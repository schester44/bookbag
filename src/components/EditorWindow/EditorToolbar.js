import React from 'react'
import { FiList, FiTrash, FiCheckSquare } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteRight } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import BlockButton from './BlockButton'
import InsertImageButton from './EditorToolbar/InsertImageButton'

import { deleteNote } from '../../entities/notes/actions'
import { sendToTrash } from '../../entities/trash/actions'
import { removeFromSearchIndex } from '../../services/search'

const canSendToTrashSelector = state => state.notes.ids.length > 1

const EditorToolbar = ({ editor, activeNote }) => {
	const dispatch = useDispatch()
	const canSendToTrash = useSelector(canSendToTrashSelector)

	const handleDelete = () => {
		removeFromSearchIndex(activeNote)

		// just delete any empty notes, don't send them to the trash
		if (activeNote.snippet.trim().length === 0 && activeNote.title.trim().length === 0) {
			dispatch(deleteNote(activeNote.id))
		} else {
			dispatch(sendToTrash({ noteId: activeNote.id }))
		}
	}

	return (
		<div className="flex justify-between items-center w-full">
			<div className="flex">
				<BlockButton format="block-quote" icon={<FaQuoteRight />} />
				<BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
				<BlockButton format="bulleted-list" icon={<FiList />} />
				<BlockButton format="checklist-item" icon={<FiCheckSquare />} />
				<InsertImageButton editor={editor} />
			</div>

			<div className="settings flex items-center">
				{canSendToTrash && (
					<div className="toolbar-btn" onClick={handleDelete}>
						<FiTrash />
					</div>
				)}
			</div>
		</div>
	)
}

export default EditorToolbar
