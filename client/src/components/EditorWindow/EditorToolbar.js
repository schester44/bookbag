import React from 'react'
import { FiList, FiCheckSquare } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteRight } from 'react-icons/fa'

import BlockButton from './BlockButton'
import InsertImageButton from './EditorToolbar/InsertImageButton'

const EditorToolbar = ({ editor }) => {
	return (
		<div className="flex justify-between items-center w-full">
			<div className="flex">
				<BlockButton format="block-quote" icon={<FaQuoteRight />} />
				<BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
				<BlockButton format="bulleted-list" icon={<FiList />} />
				<BlockButton format="checklist-item" icon={<FiCheckSquare />} />
				<InsertImageButton editor={editor} />
			</div>
		</div>
	)
}

export default EditorToolbar
