import React from 'react'
import { produce } from 'immer'
import { format } from 'date-fns'
import isHotKey from 'is-hotkey'
import Sidebar from './Sidebar'
import EditorWindow from './EditorWindow/Editor'
import api from './api'

const hasText = body => {
	const isEmpty =
		body[0].type === 'paragraph' && body[0].children.length === 1 && body[0].children[0].text === ''

	return body.length > 1 || !isEmpty
}

const initialBodyValue = [
	{
		type: 'paragraph',
		children: [{ text: '' }]
	}
]

const defaultNote = { title: '', id: undefined, body: initialBodyValue }

function App() {
	const saveTimerRef = React.useRef()
	const titleRef = React.useRef()

	const [state, setState] = React.useState({
		notesById: {},
		noteIds: [],
		activeNote: defaultNote
	})

	React.useEffect(() => {
		api.notes.getAll().then(({ notesById, noteIds }) => {
			setState(prev => ({
				...prev,
				notesById,
				noteIds,
				activeNote: notesById[noteIds[0]] || defaultNote
			}))
		})

		titleRef.current.focus()
	}, [])

	React.useEffect(() => {
		function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			if (event.ctrlKey && event.key === 'n') {
				setState(prev => ({
					...prev,
					activeNote: defaultNote
				}))
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [])

	const debouncedSave = (note, { force = false } = {}) => {
		if (!force) {
			window.clearTimeout(saveTimerRef.current)
		}

		saveTimerRef.current = window.setTimeout(
			() => {
				api.notes.save(note.id, note).then(savedNote => {
					setState(prev => {
						const newState = {
							...prev,
							notesById: { ...prev.notesById, [savedNote.id]: savedNote }
						}

						if (savedNote.id === prev.activeNote.id) {
							newState.activeNote = savedNote
						}

						if (!prev.notesById[savedNote.id]) {
							newState.noteIds = [savedNote.id, ...prev.noteIds]
						}

						return newState
					})
				})
			},
			force ? 0 : 300
		)
	}

	const handleNoteSelection = activeNote => {
		// save the new note before switching to a new one
		debouncedSave(state.activeNote, { force: true })
		setState(prev => ({ ...prev, activeNote }))
	}

	const updateProperty = (key, value) => {
		const activeNote = {
			...state.activeNote,
			[key]: value
		}

		setState(prev => ({
			...prev,
			activeNote
		}))

		debouncedSave(activeNote)
	}

	const handleNoteTitleChange = value => {
		updateProperty('title', value)
	}

	const handleNoteBodyChange = value => {
		updateProperty('body', value)
	}

	const handleKeyDown = event => {
		const shouldOpenNewTab = isHotKey('ctrl+n', event)

		if (shouldOpenNewTab) {
			setState(prev => ({
				...prev,
				activeNote: defaultNote
			}))
		}
	}

	const handleNoteDeletion = note => {
		api.notes.delete(note.id)

		setState(prev =>
			produce(prev, draft => {
				delete draft.notesById[note.id]
				draft.noteIds.splice(
					prev.noteIds.findIndex(id => id === note.id),
					1
				)

				if (prev.activeNote.id === note.id) {
					draft.activeNote = prev.notesById[prev.noteIds[1]] || defaultNote
				}
			})
		)
	}

	return (
		<div onKeyDown={handleKeyDown} className="App flex w-full h-full">
			<Sidebar
				noteIds={state.noteIds}
				notesById={state.notesById}
				onNoteSelect={handleNoteSelection}
			/>

			<div className="flex-1 bg-gray-200 flex flex-col">
				<div className="flex-1 pt-4 pl-2 pr-4 pb-8 flex flex-col">
					<div
						className="bg-white rounded-lg shadow flex-1 flex flex-col"
						style={{ maxHeight: 'calc(100vh - 80px)' }}
					>
						<input
							ref={titleRef}
							className={`border-0 px-3 pt-2 text-gray-800 placeholder-gray-300 outline-none text-3xl font-black bg-transparent mb-3 ${
								state.activeNote.title.length === 0 ? 'italic' : ''
							} `}
							placeholder="Untitled Note"
							value={state.activeNote.title}
							onChange={({ target: { value } }) => handleNoteTitleChange(value)}
						/>

						<EditorWindow
							onNoteDelete={handleNoteDeletion}
							onNoteChange={handleNoteBodyChange}
							onTitleChange={handleNoteTitleChange}
							activeNote={state.activeNote}
						/>
					</div>
					<p className="text-gray-500 text-xs text-right mt-2">
						{state.activeNote.lastUpdate ? (
							<span>Last updated {format(state.activeNote.lastUpdate, 'M/dd h:mma')}</span>
						) : (
							<span>Unsaved</span>
						)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default App
