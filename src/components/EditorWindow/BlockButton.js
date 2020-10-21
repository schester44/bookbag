import React from 'react'
import { useSlate } from 'slate-react'
import cn from 'classnames'
import { isBlockActive, toggleBlock } from './utils'

const BlockButton = ({ format, icon, inverted = false }) => {
	const editor = useSlate()
	const isActive = isBlockActive(editor, format)

	return (
		<div
			className={cn('toolbar-btn', {
				'toolbar-btn--active': isActive,
				'toolbar-btn--inverted': inverted,
			})}
			onMouseDown={(event) => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			<span>{icon}</span>
		</div>
	)
}

export default BlockButton
