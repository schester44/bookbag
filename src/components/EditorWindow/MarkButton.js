import React from 'react'
import { useSlate } from 'slate-react'

import { isMarkActive, toggleMark } from './utils'

const MarkButton = ({ format, icon, inverted }) => {
	const editor = useSlate()
	const isActive = isMarkActive(editor, format)

	return (
		<div
			className={`toolbar-btn ${isActive ? 'toolbar-btn--active' : ''} ${inverted ? 'toolbar-btn--inverted' : ''}`}
			onMouseDown={event => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<span>{icon}</span>
		</div>
	)
}
export default MarkButton
