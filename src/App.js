import React from 'react'

import Sidebar from './Sidebar'
import EditorWindow from './EditorWindow/Editor'
import api from './api'
import { format } from 'date-fns'

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
		notes: [],
		activeNote: defaultNote
	})

	React.useEffect(() => {
		api.notes.getAll().then(notes => {
			setState(prev => ({ ...prev, notes }))
		})

		titleRef.current.focus()
	}, [])

	const debouncedSave = (note, { force = false } = {}) => {
		if (!force) {
			window.clearTimeout(saveTimerRef.current)
		}

		saveTimerRef.current = window.setTimeout(
			() => {
				api.notes.save(note.id, note).then(savedNote => {
					setState(prev => {
						const activeNote = {
							...prev.activeNote,
							lastUpdate: savedNote.lastUpdate
						}

						if (!note.id) {
							activeNote.id = savedNote.id
						}

						console.log(activeNote)
						return { ...prev, activeNote }
					})
				})
			},
			force ? 0 : 300
		)
	}

	const handleNoteSelection = activeNote => {
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

	return (
		<div className="App flex w-full h-full">
			<Sidebar notes={state.notes} onNoteSelect={handleNoteSelection} />
			<div className="flex-1 bg-gray-200 flex flex-col">
				<div className="bg-white border-b border-gray-200 p-2 flex justify-end">
					<input placeholder="Search" className=" px-2 py-2 border border-gray-200 rounded" />
				</div>
				<div className="flex-1 pt-4 px-8 pb-8 flex flex-col">
					<input
						ref={titleRef}
						className="border-0 outline-none text-xl bg-transparent mb-3"
						placeholder="Untitled Note"
						value={state.activeNote.title}
						onChange={({ target: { value } }) => handleNoteTitleChange(value)}
					/>

					<div className="bg-white shadow flex-1 flex flex-col">
						<EditorWindow
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
