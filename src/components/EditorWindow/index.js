import React from 'react'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import TagList from '../TagList'

import { createNoteTag, removeNoteTag } from '../../entities/tags/actions'
import { debouncedSaveNote } from '../../entities/notes/actions'

import { activeNoteTagsSelector } from '../../entities/tags/reducer'

import { useSelector, useDispatch } from 'react-redux'
import { withLinks } from './plugins/withLinks'
import { withMarkdownShortcuts } from './plugins/withMarkdownShortcuts'
import FloatingToolbar from './FloatingToolbar'

import { debounce } from '../../utils'
import { updateSearchIndex } from '../../services/search'

const updateIndexHandler = note => {
	updateSearchIndex({ ...note, body: JSON.stringify(note.body) })
}

const debouncedUpdateSearchIndex = debounce(updateIndexHandler, 300)

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
	const editor = React.useMemo(
		() => withMarkdownShortcuts(withLinks(withHistory(withReact(createEditor())))),
		[]
	)

	const [{ note, isLoaded }, setState] = React.useState({
		isLoaded: false,
		note: undefined
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

		const updatedNote = {
			...note,
			title
		}

		debouncedUpdateSearchIndex(updatedNote)

		debouncedSaveNote(
			{
				note: updatedNote
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

		const updatedNote = {
			...note,
			body
		}

		debouncedUpdateSearchIndex(updatedNote)

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
			<FloatingToolbar />
			<div className="flex-1 shadow pb-8 bg-white flex flex-col h-full">
				<div className="flex justify-center p-2 border-b border-gray-200 mb-2 items-center">
					<EditorToolbar activeNote={active.note} />
				</div>

				<div className="px-8 pb-3">
					<input
						ref={titleRef}
						className={`border-0 leading-none text-gray-800 placeholder-gray-300 outline-none text-3xl font-semibold bg-transparent my-4 ${
							note.title.length === 0 ? 'italic' : ''
						} `}
						placeholder="Untitled Note"
						value={note.title}
						onChange={({ target: { value } }) => handleNoteTitleChange(value)}
					/>

					<div className="pb-4">
						<TagList
							ids={activeNoteTags}
							onTagCreate={handleNewTag}
							onRemoveTag={handleRemoveTag}
						/>
					</div>

					<Editor editor={editor} />
				</div>
			</div>
		</Slate>
	)
}

export default EditorWindow
