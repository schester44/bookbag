import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache()

export const client = new ApolloClient({
	cache,
	connectToDevTools: true,
	link: new HttpLink({
		credentials: 'include',
		uri: 'http://localhost:3442/graphql',
	}),
})
