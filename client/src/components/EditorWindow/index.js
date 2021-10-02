import React from 'react'
import { useMutation, useApolloClient } from '@apollo/client'
import Helmet from 'react-helmet'
import { SECRET, encrypt } from 'utils/encryption'
import Editor from 'rich-markdown-editor'
import { formatDistanceToNow } from 'date-fns'
import PaneTrigger from '../../components/PaneTrigger'

import NoteTitle from './NoteTitle'
import { updateNoteMutation } from '../../mutations'
import { noteTitleFragment } from 'queries'

const showPaneTrigger = false

const encryptValue = (value) => encrypt(JSON.stringify({ value }), SECRET)

const EditorWindow = ({ activeNote, isReadOnly }) => {
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
				const body = changes.body()
				const snippet = body.slice(0, 150)

				changes.snippet = encryptValue(snippet)

				changes.body = encryptValue(body)
			}

			if (changes.title) {
				changes.title = encryptValue(changes.title)
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

		// Setting the cached value (so the NoteList/Note updates)
		apolloClient.writeFragment({
			id: activeNote.id,
			fragment: noteTitleFragment,
			data: {
				updatedAt: new Date(),
				title: encrypt(JSON.stringify({ value: title }), SECRET),
			},
		})

		saveNote({ title })
	}

	const handleNoteBodyChange = (body) => {
		if (body !== note.body) {
			saveNote({ body })
		}
	}

	if (!note || !activeNote) return null

	return (
		<>
			<Helmet>
				<title>
					{activeNote.trashed ? '(trashed) ' : ''}
					{note.title || 'Untitled Note'}
				</title>
			</Helmet>

			<div className="h-full bg-white relative overflow-auto px-8 pb-8 shadow flex-1">
				<NoteTitle isReadOnly={isReadOnly} title={note.title} onChange={handleNoteTitleChange} />

				<p className="leading-none text-xs text-gray-400 mb-5">
					Updated {formatDistanceToNow(new Date(activeNote.updatedAt))} ago
				</p>

				<Editor
					readOnly={activeNote.trashed}
					defaultValue={activeNote.body}
					autoFocus
					onChange={handleNoteBodyChange}
				/>

				{showPaneTrigger && (
					<div className="absolute bottom-0 left-0 mb-2">
						<PaneTrigger action="show" />
					</div>
				)}
			</div>
		</>
	)
}

export default EditorWindow
