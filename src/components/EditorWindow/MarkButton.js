import React from 'react'
import { useSlate } from 'slate-react'
import cn from 'classnames'

import { isMarkActive, toggleMark } from './utils'

const MarkButton = ({ format, icon, inverted }) => {
	const editor = useSlate()
	const isActive = isMarkActive(editor, format)

	return (
		<div
			className={cn('toolbar-btn', {
				'toolbar-btn--active': isActive,
				'toolbar-btn--inverted': inverted,
			})}
			onMouseDown={(event) => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<span>{icon}</span>
		</div>
	)
}
export default MarkButton
