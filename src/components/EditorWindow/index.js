import React from 'react'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { useMutation, useApolloClient } from '@apollo/client'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
import TagList from '../TagList'
import PaneTrigger from '../../components/PaneTrigger'

import { withLinks } from './plugins/withLinks'
import { withMarkdownShortcuts } from './plugins/withMarkdownShortcuts'
import { withChecklists } from './plugins/withChecklists'

import FloatingToolbar from './FloatingToolbar'
import NoteTitle from './NoteTitle'
import { withImages } from './plugins/withImages'
import { updateNoteMutation } from '../../mutations'
import { serializeToText } from './utils'
import { noteTitleFragment } from 'queries'

// TODO: Reimplement
let activeNoteTags = []
const showPaneTrigger = false

const EditorWindow = ({ activeNote, isReadOnly }) => {
	const isFirstChange = React.useRef(true)
	const saveTimer = React.useRef()
	const [note, setNote] = React.useState(undefined)
	const apolloClient = useApolloClient()

	const [updateNote] = useMutation(updateNoteMutation)

	React.useEffect(() => {
		const timer = saveTimer.current

		return () => {
			// Save it!
			if (timer) {
				window.clearTimeout(timer)
			}
		}
	}, [saveTimer])

	const editor = React.useMemo(
		() =>
			withImages(
				withChecklists(withMarkdownShortcuts(withLinks(withHistory(withReact(createEditor())))))
			),
		[]
	)

	React.useEffect(() => {
		if (!activeNote) {
			return setNote(undefined)
		} else {
			setNote({
				...activeNote,
				body: typeof activeNote.body === 'string' ? JSON.parse(activeNote.body) : activeNote.body,
			})
		}
	}, [activeNote])

	const handleNewTag = (name) => {
		// dispatch(createNoteTag(noteId, name))
	}

	const handleRemoveTag = (tag) => {
		// dispatch(removeNoteTag(noteId, tag.id))
	}

	const saveNote = (changes) => {
		window.clearTimeout(saveTimer.current)

		saveTimer.current = window.setTimeout(() => {
			if (!activeNote) return

			if (changes.body) {
				const snippet = serializeToText(changes.body).slice(0, 150)

				changes.snippet = snippet
				changes.body = JSON.stringify(changes.body)
			}

			updateNote({
				variables: {
					id: activeNote.id,
					input: changes,
				},
			})
		}, 250)
	}

	const handleNoteTitleChange = (title) => {
		setNote((prev) => ({ ...prev, title }))

		apolloClient.writeFragment({
			id: activeNote.id,
			fragment: noteTitleFragment,
			data: {
				title,
			},
		})

		saveNote({ title })
	}

	const handleNoteBodyChange = (body) => {
		// Hack to get around this handler being called when focusing on the editor.
		// No changes have been made so there's no reason to save the note.
		if (isFirstChange.current) {
			isFirstChange.current = false
			return
		}

		if (body !== note.body) {
			setNote((prev) => ({ ...prev, body }))
			saveNote({ body })
		}
	}

	if (!note) return null

	return (
		<Slate editor={editor} value={note.body} onChange={handleNoteBodyChange}>
			<FloatingToolbar />
			<div className="flex-1 shadow pb-8 bg-white flex flex-col h-full relative">
				{!isReadOnly && (
					<div className="flex justify-center p-2 border-b border-gray-200 mb-2 items-center">
						<EditorToolbar activeNote={activeNote} editor={editor} />
					</div>
				)}

				<div className="px-8 pb-3">
					<NoteTitle isReadOnly={isReadOnly} title={note.title} onChange={handleNoteTitleChange} />

					{!isReadOnly && (
						<div className="pb-4">
							<TagList
								ids={activeNoteTags}
								onTagCreate={handleNewTag}
								onRemoveTag={handleRemoveTag}
							/>
						</div>
					)}

					<Editor editor={editor} isReadOnly={isReadOnly} />
				</div>

				{showPaneTrigger && (
					<div className="absolute bottom-0 left-0 mb-2">
						<PaneTrigger action="show" />
					</div>
				)}
			</div>
		</Slate>
	)
}

export default EditorWindow
