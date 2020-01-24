import React from 'react'
import { format } from 'date-fns'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import TagList from '../TagList'

// TODO: Store the activeNote state in this editor, and periodically save/sync with redux. sync with redux on un-mount
// TODO: Remove this state var in favor of conencting to redux.
const EditorWindow = ({
	state,
	onNoteTitleChange,
	onNoteDeletion,
	onNoteBodyChange,
	handleNewTag,
	handleRemoveTagFromNote
}) => {
	const titleRef = React.useRef()

	const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

	React.useEffect(() => {
		titleRef.current.focus()
	}, [])

	return (
		<Slate editor={editor} value={state.activeNote.body} onChange={onNoteBodyChange}>
			<div className="flex-1 shadow px-12 py-8 bg-white flex flex-col">
				<div className="flex-1 flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
					<div className="flex justify-center border-b border-gray-200">
						<EditorToolbar
							activeNote={state.activeNote}
							onDelete={() => onNoteDeletion(state.activeNote)}
						/>
					</div>

					<input
						ref={titleRef}
						className={`border-0 text-gray-800 placeholder-gray-300 outline-none text-3xl font-semibold bg-transparent my-4 ${
							state.activeNote.title.length === 0 ? 'italic' : ''
						} `}
						placeholder="Untitled Note"
						value={state.activeNote.title}
						onChange={({ target: { value } }) => onNoteTitleChange(value)}
					/>

					<div className="pt-2 py-4">
						<TagList
							tagIds={state.activeNoteTags}
							tagsById={state.tags.idMap}
							onTagCreate={handleNewTag}
							onRemoveTagFromNote={handleRemoveTagFromNote}
						/>
					</div>

					<Editor editor={editor} />
				</div>
				<p className="text-gray-500 text-xs text-right mt-2">
					{state.activeNote.lastUpdate ? (
						<span>Last updated {format(state.activeNote.lastUpdate, 'M/dd h:mma')}</span>
					) : (
						<span>Unsaved</span>
					)}
				</p>
			</div>
		</Slate>
	)
}

export default EditorWindow
