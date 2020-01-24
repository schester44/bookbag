import React from 'react'
import { useSlate } from 'slate-react'

import { isBlockActive, toggleBlock } from './utils'

const BlockButton = ({ format, icon, inverted = false }) => {
	const editor = useSlate()
	const isActive = isBlockActive(editor, format)

	return (
		<div
			className={`toolbar-btn ${isActive ? 'toolbar-btn--active' : ''} ${inverted ? 'toolbar-btn--inverted' : ''}`}
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
