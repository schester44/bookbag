import React from 'react'
import { produce } from 'immer'

import isHotKey from 'is-hotkey'
import Sidebar from './Sidebar'
import { useDispatch } from 'react-redux'
import api from './api'

import EditorWindow from './components/EditorWindow'

import { tagsFetched } from './actions/tags'
import { fetchNotes } from './actions/notes'
import { GoNote } from 'react-icons/go'
import { FiHash, FiSettings } from 'react-icons/fi'

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
	}, [dispatch])

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
			<div className="w-12 h-full bg-gray-900 text-gray-200 flex flex-col justify-between pb-4">
				<div>
					<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
						<GoNote />
					</div>
					<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
						<FiHash />
					</div>
				</div>

				<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
					<FiSettings />
				</div>
			</div>
			<Sidebar
				activeNote={state.activeNote}
				tagsById={state.tags.idMap}
				tagIds={state.tags.ids}
				noteIds={state.noteIds}
				notesById={state.notesById}
				onTagSelect={console.log}
				onNoteSelect={handleNoteSelection}
			/>
			<EditorWindow
				state={state}
				onNoteTitleChange={handleNoteTitleChange}
				onNoteDeletion={handleNoteDeletion}
				onNoteBodyChange={handleNoteBodyChange}
				handleNewTag={handleNewTag}
				handleRemoveTagFromNote={handleRemoveTagFromNote}
			/>
		</div>
	)
}

export default App
