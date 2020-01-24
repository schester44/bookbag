import React from 'react'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import TagList from '../TagList'

import { createNoteTag, removeNoteTag } from '../../actions/tags'
import { debouncedSaveNote } from '../../actions/notes'

import { activeNoteTagsSelector } from '../../reducers'
import { useSelector, useDispatch } from 'react-redux'

const activeNoteSelector = state => {
	return {
		id: state.editor.activeNoteId,
		note: state.notes.idMap[state.editor.activeNoteId]
	}
}

const EditorWindow = () => {
	const active = useSelector(activeNoteSelector)
	const dispatch = useDispatch()
	const activeNoteTags = useSelector(activeNoteTagsSelector(active.id))
	const titleRef = React.useRef()
	const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

	// TODO: Save the note before unmounting, only if the note hasn't been deleted
	const [{ note, isLoaded }, setState] = React.useState({
		isLoaded: false
	})

	React.useEffect(() => {
		if (!active.id) return

		// Set the initial value on load.
		setState(prev => {
			if (prev.note?.id === active.id) return prev

			return {
				isLoaded: true,
				note: active.note
			}
		})
	}, [active])

	React.useEffect(() => {
		if (!titleRef.current) return

		titleRef.current.focus()
	}, [])

	const handleNewTag = name => {
		dispatch(createNoteTag(active.id, name))
	}

	const handleRemoveTag = tag => {
		dispatch(removeNoteTag(active.id, tag.id))
	}

	const handleNoteTitleChange = title => {
		setState(prev => {
			return {
				...prev,
				note: {
					...prev.note,
					title
				}
			}
		})

		debouncedSaveNote(
			{
				note: {
					...note,
					title
				}
			},
			dispatch
		)
	}

	const handleNoteBodyChange = body => {
		setState(prev => {
			return {
				...prev,
				note: {
					...prev.note,
					body
				}
			}
		})

		debouncedSaveNote(
			{
				note: {
					...note,
					body
				}
			},
			dispatch
		)
	}

	if (!isLoaded) return null

	return (
		<Slate editor={editor} value={note.body} onChange={handleNoteBodyChange}>
			<div className="flex-1 shadow px-12 py-8 bg-white flex flex-col h-full">
				<div className="flex justify-center border-b border-gray-200">
					<EditorToolbar activeNote={active.note} />
				</div>

				<input
					ref={titleRef}
					className={`border-0 text-gray-800 placeholder-gray-300 outline-none text-3xl font-semibold bg-transparent my-4 ${
						note.title.length === 0 ? 'italic' : ''
					} `}
					placeholder="Untitled Note"
					value={note.title}
					onChange={({ target: { value } }) => handleNoteTitleChange(value)}
				/>

				<div className="pt-2 py-4">
					<TagList ids={activeNoteTags} onTagCreate={handleNewTag} onRemoveTag={handleRemoveTag} />
				</div>

				<Editor editor={editor} />
			</div>
		</Slate>
	)
}

export default EditorWindow
