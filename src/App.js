import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Sidebar from './components/Sidebar'
import EditorWindow from './components/EditorWindow'

import { initNotes, openNewNote } from './entities/notes/actions'
import { fetchTags } from './entities/tags/actions'
import Settings from './views/Settings'

import { createSearchIndex, createTagSearchIndex } from './services/search'
import { fetchNotebooks } from './entities/notebooks/actions'

function App() {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(fetchNotebooks())

		dispatch(fetchTags()).then(tags => {
			createTagSearchIndex({ tags: tags.ids.map(id => tags.idMap[id]) })
		})

		dispatch(initNotes()).then(notes => {
			createSearchIndex({ notes: notes.ids.map(id => notes.idMap[id]) })
		})
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

	return (
		<div className="App flex w-full h-full">
			<React.Suspense fallback={null}>
				<Switch>
					<Route
						exact
						path={['/', '/note/:noteId', '/trash', '/notebook/:notebookId/:noteId?', '/tags']}
					>
						<Sidebar />
						<EditorWindow />
					</Route>

					<Route path="/settings">
						<Settings />
					</Route>
				</Switch>
			</React.Suspense>
		</div>
	)
}

export default App
