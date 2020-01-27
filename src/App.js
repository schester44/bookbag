import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import AppNav from './components/AppNav'
import Sidebar from './components/Sidebar'
import EditorWindow from './components/EditorWindow'

import { initNotes, openNewNote } from './actions/notes'
import { fetchTags } from './actions/tags'
import Settings from './views/Settings'

import { createSearchIndex } from './services/search'

const Trash = React.lazy(() => import('./views/Trash'))

function App() {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(fetchTags())
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
			<AppNav />

			<React.Suspense fallback={null}>
				<Switch>
					<Route exact path={['/', '/tags']}>
						<Sidebar />
						<EditorWindow />
					</Route>

					<Route path="/trash">
						<Trash />
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
