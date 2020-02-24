import React from 'react'
import { useSelected, useFocused } from 'slate-react'

export const Image = ({ attributes, element, children }) => {
	const selected = useSelected()
	const focused = useFocused()

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<img
					src={element.url}
					alt={element.url}
					className={selected && focused ? 'border border-indigo-500' : 'border border-transparent'}
					style={{
						display: 'block',
						maxWidth: '100%',
						maxHeight: '20em'
					}}
				/>
			</div>
			{children}
		</div>
	)
}
