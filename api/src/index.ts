require('dotenv').config()

import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'

import express, { Request } from 'express'

import { logger } from './utils/logging'
import middlewares from './modules/middlewares'

import { buildSchema } from 'type-graphql'
import { createConnection } from './db'
import { User } from './entity/User'
import { resolvers } from './schema'
import { GQLContext } from './types/GQLContext'

const PORT = 3442
const debug = require('debug')('api:main')

process.on('unhandledRejection', (error) => {
	console.log('unhandled', error)
})

async function main() {
	await createConnection()

	const schema = await buildSchema({
		resolvers,
	})

	const apolloServer = new ApolloServer({
		// introspection: false,
		schema,
		context: async ({ req, res }: { req: Request; res: Response }): Promise<GQLContext> => {

			if (req.session.userId) {
				const user = await User.findOne({ where: { id: req.session.userId } })

				// TODO: Don't make a request for the user on every request. should be able to use the session to know if the user exists or not.
				if (user) {
					return { user, req, res }
				}
			}

			return { req, res }
		},
	})

	const app = express()

	app.use(middlewares)

	apolloServer.applyMiddleware({
		app,
		cors: false,
	})
	debug('starting')
	app.listen(PORT, () => {
		logger.info(`🚀 Server ready at http://localhost:${PORT}`)
	})
}

main()
