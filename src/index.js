import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import App from './App'
import './styles/tailwind.css'

import { history } from './utils'
import { ApolloProvider } from '@apollo/client'
import { client } from './apollo-client'

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router history={history}>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
)
