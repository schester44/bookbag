import React from 'react'
import { getUser } from '../api'
import { useHistory } from 'react-router'

const UserContext = React.createContext({
	user: undefined,
	loading: false,
	setUser: () => {}
})

export const useUser = () => {
	return React.useContext(UserContext)
}

export const AuthProvider = ({ children }) => {
	const history = useHistory()

	const [state, setState] = React.useState({
		user: undefined,
		loading: true
	})

	React.useEffect(() => {
		const isAuthed = localStorage.getItem('isAuthenticated')

		if (!isAuthed) {
			return setState(prev => ({ ...prev, loading: false }))
		}

		getUser().then(
			user => {
				setState(prev => ({ ...prev, user, loading: false }))
			},
			() => {
				setState(prev => ({ ...prev, loading: false }))
				history.push('/auth/login')
			}
		)
	}, [history])

	const setUser = user => {
		if (user) {
			localStorage.setItem('isAuthenticated', true)
		}

		setState(prev => ({ ...prev, user }))
	}

	const value = { user: state.user, loading: state.loading, setUser }

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
