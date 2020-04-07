import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import Bookbag from 'views/BookBag'
import Settings from 'views/Settings'
import { userQuery } from './queries'

const Login = React.lazy(() => import('views/Login'))

const bookBagRoutes = [
	'/',
	'/note/:noteId',
	'/trash',
	'/trash/:noteId',
	'/notebook/:notebookId/:noteId?',
	'/tags',
]

function GuestRoutes() {
	return (
		<div className="App w-full h-full">
			<React.Suspense fallback={null}>
				<Route path="/">
					<Login />
				</Route>
			</React.Suspense>
		</div>
	)
}

function App() {
	const { data, loading } = useQuery(userQuery, {
		skip: !localStorage.getItem('logged-in'),
	})

	if (loading) return <div>LOADING</div>

	const user = data?.me

	if (!user) {
		return <GuestRoutes />
	}

	return (
		<div className="App w-full h-full">
			<React.Suspense fallback={null}>
				<Switch>
					<Route exact path={bookBagRoutes}>
						<Bookbag user={user} />
					</Route>

					<Route path="/settings">
						<Settings user={user} />
					</Route>
				</Switch>
			</React.Suspense>
		</div>
	)
}

export default App
