import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import Bookbag from 'views/BookBag'
import { userQuery } from './queries'
import { SidebarProvider } from 'hooks/useSidebar'

const Login = React.lazy(() => import('views/Login'))

const bookBagRoutes = [
	'/',
	'/note/:noteId',
	'/trash',
	'/trash/:noteId',
	'/notebook/:notebookId/:noteId?',
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
		<SidebarProvider>
			<div className="App w-full h-full">
				<React.Suspense fallback={null}>
					<Switch>
						<Route exact path={bookBagRoutes}>
							<Bookbag user={user} />
						</Route>
					</Switch>
				</React.Suspense>
			</div>
		</SidebarProvider>
	)
}

export default App
