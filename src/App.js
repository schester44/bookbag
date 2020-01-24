import React from 'react'

import isHotKey from 'is-hotkey'
import { useDispatch } from 'react-redux'

import AppNav from './components/AppNav'
import Sidebar from './components/Sidebar'
import EditorWindow from './components/EditorWindow'

import { initNotes, openNewNote } from './actions/notes'
import { fetchTags } from './actions/tags'

function App() {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(fetchTags())
		dispatch(initNotes())
	}, [dispatch])

	React.useEffect(() => {
		function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			if (event.ctrlKey && event.key === 'n') {
				dispatch(openNewNote())
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [dispatch])

	const handleKeyDown = event => {
		const shouldOpenNewTab = isHotKey('ctrl+n', event)

		if (shouldOpenNewTab) {
			dispatch(openNewNote())
		}
	}

	return (
		<div onKeyDown={handleKeyDown} className="App flex w-full h-full">
			<AppNav />
			<Sidebar />
			<EditorWindow />
		</div>
	)
}

export default App
