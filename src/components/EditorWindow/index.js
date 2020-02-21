import React from 'react'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import TagList from '../TagList'

import { createNoteTag, removeNoteTag } from '../../entities/tags/actions'
import { debouncedSaveNote } from '../../entities/notes/actions'

import { withLinks } from './plugins/withLinks'
import { withMarkdownShortcuts } from './plugins/withMarkdownShortcuts'

import FloatingToolbar from './FloatingToolbar'
import { debounce } from '../../utils'
import { updateSearchIndex } from '../../services/search'
import NoteTitle from './NoteTitle'

const updateIndexHandler = note => {
	updateSearchIndex({ ...note, body: JSON.stringify(note.body) })
}

const debouncedUpdateSearchIndex = debounce(updateIndexHandler, 300)

const defaultTagsArray = []

const activeNoteSelector = id => state => {
	return {
		activeNote: state.notes.idMap[id],
		activeNoteTags: state.tags.byNote[id] || defaultTagsArray
	}
}

const EditorWindow = () => {
	const dispatch = useDispatch()
	const { noteId } = useParams()
	const isFirstChange = React.useRef(true)

	const { activeNote, activeNoteTags } = useSelector(activeNoteSelector(noteId))

	const editor = React.useMemo(
		() => withMarkdownShortcuts(withLinks(withHistory(withReact(createEditor())))),
		[]
	)

	const [{ note, isLoaded }, setState] = React.useState({
		isLoaded: false,
		note: undefined
	})

	React.useEffect(() => {
		if (!activeNote?.id) return

		// Set the initial value on load.
		setState(prev => {
			// if the note is already set then we don't want to override it... We only wany to set state.note on initial load (get its body, title, etc)
			if (prev.note?.id === activeNote.id) return prev

			return {
				isLoaded: true,
				note: { ...activeNote }
			}
		})
	}, [activeNote])

	const handleNewTag = name => {
		dispatch(createNoteTag(noteId, name))
	}

	const handleRemoveTag = tag => {
		dispatch(removeNoteTag(noteId, tag.id))
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
		// Hack to get around this handler being called when focusing on the editor.
		// No changes have been made so there's no reason to save the note.
		if (isFirstChange.current) {
			isFirstChange.current = false
			return
		}

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

	if (!isLoaded || !note) return null

	return (
		<Slate editor={editor} value={note.body} onChange={handleNoteBodyChange}>
			<FloatingToolbar />
			<div className="flex-1 shadow pb-8 bg-white flex flex-col h-full">
				<div className="flex justify-center p-2 border-b border-gray-200 mb-2 items-center">
					<EditorToolbar activeNote={activeNote} />
				</div>

				<div className="px-8 pb-3">
					<NoteTitle title={note.title} onChange={handleNoteTitleChange} />

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
