import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Bookbag from './views/BookBag'
import Settings from './views/Settings'

function App() {
	return (
		<div className="App w-full h-full">
			<React.Suspense fallback={null}>
				<Switch>
					<Route
						exact
						path={['/', '/note/:noteId', '/trash', '/notebook/:notebookId/:noteId?', '/tags']}
					>
						<Bookbag />
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
