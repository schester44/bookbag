import React from 'react'
import { useMutation } from '@apollo/client'
import { FiList, FiTrash, FiCheckSquare } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteRight } from 'react-icons/fa'

import BlockButton from './BlockButton'
import InsertImageButton from './EditorToolbar/InsertImageButton'

import { updateNoteMutation } from '../../mutations'
import useDeleteNote from 'hooks/useDeleteNote'
import { useHistory } from 'react-router'

const EditorToolbar = ({ editor, activeNote }) => {
	const [updateNote] = useMutation(updateNoteMutation)
	const [deleteNote] = useDeleteNote({ id: activeNote?.id })
	const history = useHistory()

	const handleDelete = () => {
		const isEmpty = activeNote.snippet.trim().length === 0 && activeNote.title.trim().length === 0

		history.push('/')

		// just delete any empty notes, don't send them to the trash
		if (isEmpty) {
			deleteNote()
		} else {
			updateNote({
				variables: {
					id: activeNote.id,
					input: {
						trashed: true,
					},
				},
			})
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
				<div className="toolbar-btn" onClick={handleDelete}>
					<FiTrash />
				</div>
			</div>
		</div>
	)
}

export default EditorToolbar
