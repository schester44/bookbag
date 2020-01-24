import React from 'react'
import { produce } from 'immer'
import { format } from 'date-fns'
import isHotKey from 'is-hotkey'
import Sidebar from './Sidebar'
import { useDispatch } from 'react-redux'
import api from './api'

import EditorWindow from './components/EditorWindow/Editor'
import TagList from './components/TagList'

import { tagsFetched } from './actions/tags'
import { fetchNotes } from './actions/notes'

const initialBodyValue = [
	{
		type: 'paragraph',
		children: [{ text: '' }]
	}
]

const defaultNote = { title: '', id: undefined, body: initialBodyValue }

function App() {
	const dispatch = useDispatch()

	const saveTimerRef = React.useRef()
	const titleRef = React.useRef()

	const [state, setState] = React.useState({
		tags: {
			idMap: {},
			ids: []
		},
		notesById: {},
		noteIds: [],
		activeNoteTags: [],
		activeNote: defaultNote
	})

	React.useEffect(() => {
		dispatch(fetchNotes())

		// TODO: Don't store `activeNoteTags` -- store all with easy look up by noteId

		Promise.all([api.notes.getAll(), api.tags.getAll()]).then(async ([{ idMap, ids }, tags]) => {
			dispatch(tagsFetched({ tags }))

			let activeNoteTags = []

			const lastOpenedId = await api.notes.lastOpened.get()

			const idOfNote = lastOpenedId || ids[0]

			if (idMap[idOfNote]) {
				activeNoteTags = await api.tags.getByNote(idOfNote)
			}

			setState(prev => ({
				...prev,
				tags,
				notesById: idMap,
				noteIds: ids,
				activeNoteTags,
				activeNote: idMap[idOfNote] || defaultNote
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

						if (!prev.activeNote.id || savedNote.id === prev.activeNote.id) {
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

		api.tags.getByNote(activeNote.id).then(activeNoteTags => {
			api.notes.lastOpened.save(activeNote.id)
			setState(prev => ({ ...prev, activeNote, activeNoteTags }))
		})
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

	const addNoteTagToState = tag => {
		setState(prev => {
			const idMap = {
				...prev.tags.idMap,
				[tag.id]: tag
			}

			return {
				...prev,
				activeNoteTags: prev.activeNoteTags.includes(tag.id)
					? prev.activeNoteTags
					: prev.activeNoteTags.concat(tag.id),
				tags: {
					ids: prev.tags.ids.concat(tag.id),
					idMap
				}
			}
		})
	}

	const handleNewTag = async name => {
		// TODO: handle thsi in the save function

		const existingTagId = state.tags.ids.find(id => {
			const tag = state.tags.idMap[id]
			return tag.name.toLowerCase() === name.toLowerCase().trim()
		})

		let tag

		if (!existingTagId) {
			tag = await api.tags.save(null, { name })
		} else {
			tag = state.tags.idMap[existingTagId]
		}

		// TODO: error
		if (!tag) return

		api.tags.addToNote(tag.id, state.activeNote.id)
		addNoteTagToState(tag)
	}

	const handleRemoveTagFromNote = tag => {
		setState(prev =>
			produce(prev, draft => {
				const index = prev.activeNoteTags.findIndex(id => id === tag.id)

				console.log(tag.id, prev.activeNoteTags)
				if (index > -1) {
					draft.activeNoteTags.splice(index, 1)
				}

				api.tags.removeFromNote(tag.id, state.activeNote.id)
			})
		)
	}

	return (
		<div onKeyDown={handleKeyDown} className="App flex w-full h-full">
			<Sidebar
				activeNote={state.activeNote}
				tagsById={state.tags.idMap}
				tagIds={state.tags.ids}
				noteIds={state.noteIds}
				notesById={state.notesById}
				onTagSelect={console.log}
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
							className={`border-0 px-6 pt-3 text-gray-800 placeholder-gray-300 outline-none text-2xl font-black bg-transparent mb-3 ${
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
						<TagList
							tagIds={state.activeNoteTags}
							tagsById={state.tags.idMap}
							onTagCreate={handleNewTag}
							onRemoveTagFromNote={handleRemoveTagFromNote}
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
