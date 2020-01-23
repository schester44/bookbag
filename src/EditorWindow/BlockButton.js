import React from 'react'
import { useSlate } from 'slate-react'

import { isBlockActive, toggleBlock } from './utils'

const BlockButton = ({ format, icon }) => {
	const editor = useSlate()
	const isActive = isBlockActive(editor, format)

	return (
		<div
			className={`toolbar-btn ${isActive ? 'toolbar-btn--active' : ''}`}
			onMouseDown={event => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			<span>{icon}</span>
		</div>
	)
}

export default BlockButton
