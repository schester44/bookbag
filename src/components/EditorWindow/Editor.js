import React from 'react'
import isHotkey from 'is-hotkey'
import { Editable } from 'slate-react'
import { useDispatch } from 'react-redux'

import Element from './Element'
import Leaf from './Leaf'

import { toggleMark } from './utils'
import { HOTKEYS } from './constants'
import { openNewNote } from '../../entities/notes/actions'
import { useParams } from 'react-router-dom'

const Editor = ({ editor, isReadOnly }) => {
	const dispatch = useDispatch()
	const { notebookId } = useParams()

	const renderElement = React.useCallback(props => <Element {...props} />, [])
	const renderLeaf = React.useCallback(props => <Leaf {...props} />, [])

	const handleKeyDown = event => {
		const shouldOpenNewTab = isHotkey('mod+n', event)
		if (shouldOpenNewTab) {
			dispatch(openNewNote({ notebookId }))
			return
		}

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
				readOnly={isReadOnly}
				onKeyDown={handleKeyDown}
			/>
		</div>
	)
}

export default Editor
