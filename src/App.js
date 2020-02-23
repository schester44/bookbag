import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Bookbag from './views/BookBag'
import Settings from './views/Settings'

const bookBagRoutes = [
	'/',
	'/note/:noteId',
	'/trash',
	'/trash/:noteId',
	'/notebook/:notebookId/:noteId?',
	'/tags'
]

function App() {
	return (
		<div className="App w-full h-full">
			<React.Suspense fallback={null}>
				<Switch>
					<Route exact path={bookBagRoutes}>
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
