import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux-store'
import './styles/tailwind.css'

import { history } from './utils'

ReactDOM.render(
	<Router history={history}>
		<Provider store={store}>
			<App />
		</Provider>
	</Router>,

	document.getElementById('root')
)
