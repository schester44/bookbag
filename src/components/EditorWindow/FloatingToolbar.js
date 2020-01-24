import React from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import { FiBold, FiItalic, FiUnderline, FiCode } from 'react-icons/fi'

import MarkButton from './MarkButton'

const FloatingToolbar = () => {
	const ref = React.useRef()
	const editor = useSlate()

	React.useEffect(() => {
		const el = ref.current
		const { selection } = editor

		if (!el) {
			return
		}

		if (
			!selection ||
			!ReactEditor.isFocused(editor) ||
			Range.isCollapsed(selection) ||
			Editor.string(editor, selection) === ''
		) {
			el.style.top = '-10000px'
			el.style.left = '-10000px'
			el.style.opacity = 0
			return
		}

		const domSelection = window.getSelection()
		const domRange = domSelection.getRangeAt(0)
		const rect = domRange.getBoundingClientRect()
		el.style.opacity = 1
		el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
		el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
	})

	return (
		<div
			ref={ref}
			className="absolute z-10 p-1 px-4 bg-gray-800 text-sm text-gray-100 rounded-full"
			style={{
				position: 'absolute',
				padding: 8,
				zIndex: 1,
				top: '-10000px',
				left: '-10000px',
				marginTop: -6,
				opacity: 0,
				transition: 'opacity 0.25s'
			}}
		>
			<div className="flex px-4">
				<MarkButton inverted format="bold" icon={<FiBold />} />
				<MarkButton inverted format="italic" icon={<FiItalic />} />
				<MarkButton inverted format="underline" icon={<FiUnderline />} />
				<MarkButton inverted format="code" icon={<FiCode />} />
			</div>
		</div>
	)
}

export default FloatingToolbar
