import React from 'react'
import {
	FiBold,
	FiItalic,
	FiUnderline,
	FiCode,
	FiList,
	FiTrash,
	FiCheckSquare
} from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaHeading, FaQuoteRight } from 'react-icons/fa'

import MarkButton from './MarkButton'
import BlockButton from './BlockButton'
import { useDispatch, useSelector } from 'react-redux'

import { deleteNote } from '../../actions/notes'

const totalNotesSelector = state => state.notes.ids.length

const EditorToolbar = ({ activeNote }) => {
	const dispatch = useDispatch()
	const totalNotes = useSelector(totalNotesSelector)

	const handleDelete = () => {
		dispatch(deleteNote(activeNote.id))
	}

	return (
		<div className="px-2 pb-2 flex justify-between w-full">
			<div className="flex">
				<MarkButton format="bold" icon={<FiBold />} />
				<MarkButton format="italic" icon={<FiItalic />} />
				<MarkButton format="underline" icon={<FiUnderline />} />
				<MarkButton format="code" icon={<FiCode />} />
				<BlockButton format="heading-one" icon={<FaHeading />} />
				<BlockButton format="heading-two" icon={<FaHeading />} />
				<BlockButton format="block-quote" icon={<FaQuoteRight />} />
				<BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
				<BlockButton format="bulleted-list" icon={<FiList />} />
				<BlockButton format="todo-item" icon={<FiCheckSquare />} />
			</div>

			<div className="settings">
				{totalNotes > 1 && (
					<div className="toolbar-btn" onClick={handleDelete}>
						<FiTrash />
					</div>
				)}
			</div>
		</div>
	)
}

export default EditorToolbar
