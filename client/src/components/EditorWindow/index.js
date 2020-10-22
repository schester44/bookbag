import React from 'react'
import { withReact, Slate } from 'slate-react'
import { Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { useMutation, useApolloClient } from '@apollo/client'
import Helmet from 'react-helmet'
import { SECRET, encrypt } from 'utils/encryption'

import Editor from './Editor'
import EditorToolbar from './EditorToolbar'
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

	const _activeNodeId = React.useRef(activeNote?.id)

	// Clear the selection when changing notes.
	React.useEffect(() => {
		if (_activeNodeId.current !== activeNote?.id) {
			_activeNodeId.current = activeNote?.id
			Transforms.deselect(editor)
		}
	}, [activeNote, editor])

	React.useEffect(() => {
		// Only set the note once
		if (activeNote?.id !== note?.id) {
			setNote(activeNote)
		}
	}, [activeNote, note])

	const saveNote = (changes) => {
		window.clearTimeout(saveTimer.current)

		saveTimer.current = window.setTimeout(() => {
			if (!activeNote) return

			if (changes.body) {
				const snippet = serializeToText(changes.body).slice(0, 150)

				changes.snippet = encrypt(JSON.stringify({ value: snippet }), SECRET)
				changes.body = encrypt(JSON.stringify(changes.body), SECRET)
			}

			if (changes.title) {
				changes.title = encrypt(JSON.stringify({ value: changes.title }), SECRET)
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

		// Setting the cached value
		apolloClient.writeFragment({
			id: activeNote.id,
			fragment: noteTitleFragment,
			data: {
				title: encrypt(JSON.stringify({ value: title }), SECRET),
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
			<Helmet>
				<title>
					{note.trashed ? '(trashed) ' : ''}
					{note.title || 'Untitled Note'}
				</title>
			</Helmet>

			<FloatingToolbar />
			<div className="flex-1 shadow pb-8 bg-white flex flex-col h-full max-h-half lg:max-h-full relative overflow-auto">
				{!isReadOnly && (
					<div className="flex justify-center p-2 border-b border-gray-200 mb-2 items-center">
						<EditorToolbar activeNote={activeNote} editor={editor} />
					</div>
				)}

				<div className="px-8 pb-3 flex-1">
					<NoteTitle isReadOnly={isReadOnly} title={note.title} onChange={handleNoteTitleChange} />

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
