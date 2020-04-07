import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import resolvers from './resolvers'

const cache = new InMemoryCache({
	dataIdFromObject: (object) => object.id,
})

export const client = new ApolloClient({
	resolvers,
	cache,
	connectToDevTools: true,
	link: new HttpLink({
		uri: 'http://localhost:3442/graphql',
	}),
})
