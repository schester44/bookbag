import React from 'react'
import { useParams } from 'react-router-dom'
import isHotkey from 'is-hotkey'
import { Editable } from 'slate-react'
import { useMutation } from '@apollo/client'
import Element from './Element'
import Leaf from './Leaf'

import { toggleMark } from './utils'
import { HOTKEYS } from './constants'

import { createNoteMutation } from '../../mutations'

const Editor = ({ editor, isReadOnly }) => {
	const { notebookId } = useParams()
	const [createNote] = useMutation(createNoteMutation)

	const renderElement = React.useCallback((props) => <Element {...props} />, [])
	const renderLeaf = React.useCallback((props) => <Leaf {...props} />, [])

	const handleKeyDown = (event) => {
		const shouldOpenNewTab = isHotkey('mod+n', event)
		if (shouldOpenNewTab) {
			return createNote({ variables: { notebookId } })
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
