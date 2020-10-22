import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { decrypt, SECRET } from 'utils/encryption'

const cache = new InMemoryCache({
	typePolicies: {
		Note: {
			fields: {
				// Ref: https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function
				// After the field has been updated, what should we do?
				// We need to decrypt the fields so that they can be read
				// We send the notes encrypted and need to decrypt them on response
				title: {
					merge(_, incoming) {
						try {
							const decrypted = JSON.parse(decrypt(incoming, SECRET))

							return decrypted.value
						} catch {
							return incoming
						}
					},
				},
				body: {
					merge(_, incoming) {
						if (Array.isArray(incoming)) return incoming

						const decryptedBody = decrypt(incoming, SECRET)

						return JSON.parse(decryptedBody)
					},
				},
				snippet: {
					merge(_, incoming) {
						try {
							const decrypted = JSON.parse(decrypt(incoming, SECRET))

							return decrypted.value
						} catch {
							return incoming
						}
					},
				},
			},
		},
	},
	dataIdFromObject: (object) => object.id,
})

export const client = new ApolloClient({
	cache,
	connectToDevTools: true,
	link: new HttpLink({
		credentials: 'include',
		uri: 'http://localhost:3442/graphql',
	}),
})
