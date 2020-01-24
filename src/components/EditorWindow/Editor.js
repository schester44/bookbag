import React from 'react'
import isHotkey from 'is-hotkey'
import { Editable } from 'slate-react'

import Element from './Element'
import Leaf from './Leaf'

import { toggleMark } from './utils'
import { HOTKEYS } from './constants'

const EditorWindow = ({ editor }) => {
	const renderElement = React.useCallback(props => <Element {...props} />, [])
	const renderLeaf = React.useCallback(props => <Leaf {...props} />, [])

	const handleKeyDown = event => {
		for (const hotkey in HOTKEYS) {
			if (isHotkey(hotkey, event)) {
				event.preventDefault()
				const mark = HOTKEYS[hotkey]
				toggleMark(editor, mark)
			}
		}
	}

	return (
		<div className="py-4 overflow-auto flex-1">
			<Editable
				className="h-full text-gray-900"
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder="Whats on your mind?"
				spellCheck
				autoFocus
				onKeyDown={handleKeyDown}
			/>
		</div>
	)
}

export default EditorWindow
