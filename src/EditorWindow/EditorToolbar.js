import React from 'react'
import { FiBold, FiItalic, FiUnderline, FiCode, FiList } from 'react-icons/fi'
import { MdFormatListNumbered } from 'react-icons/md'
import { FaHeading, FaQuoteRight } from 'react-icons/fa'

import MarkButton from './MarkButton'
import BlockButton from './BlockButton'

const EditorToolbar = () => {
	return (
		<div className="flex border-b border-gray-200 p-2 mb-2">
			<MarkButton format="bold" icon={<FiBold />} />
			<MarkButton format="italic" icon={<FiItalic />} />
			<MarkButton format="underline" icon={<FiUnderline />} />
			<MarkButton format="code" icon={<FiCode />} />
			<BlockButton format="heading-one" icon={<FaHeading />} />
			<BlockButton format="heading-two" icon={<FaHeading />} />
			<BlockButton format="block-quote" icon={<FaQuoteRight />} />
			<BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
			<BlockButton format="bulleted-list" icon={<FiList />} />
		</div>
	)
}

export default EditorToolbar
