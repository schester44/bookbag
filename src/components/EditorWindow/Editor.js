import React from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import EditorToolbar from './EditorToolbar'
import Element from './Element'
import Leaf from './Leaf'

import { toggleMark } from './utils'
import { HOTKEYS } from './constants'

const EditorWindow = ({ activeNote, onNoteChange, onNoteDelete }) => {
	const renderElement = React.useCallback(props => <Element {...props} />, [])
	const renderLeaf = React.useCallback(props => <Leaf {...props} />, [])
	const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

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
		<Slate editor={editor} value={activeNote.body} onChange={onNoteChange}>
			<EditorToolbar activeNote={activeNote} onDelete={() => onNoteDelete(activeNote)} />

			<div className="px-8 pt-4 overflow-auto flex-1">
				<Editable
					className="h-full text-gray-800"
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder="Whats on your mind?"
					spellCheck
					autoFocus
					onKeyDown={handleKeyDown}
				/>
			</div>
		</Slate>
	)
}

export default EditorWindow
