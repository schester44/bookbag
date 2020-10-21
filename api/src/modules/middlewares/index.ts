import { Router } from 'express'

import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import connectRedis from 'connect-redis'
import { redis } from '../../redis'

const debug = require('debug')('api:middlewares')

const middlewares = Router()

const RedisStore = connectRedis(session)

function logResponseTime(req, res, next) {
	const startHrTime = process.hrtime()

	debug(req.path, 'fetching')

	res.on('finish', () => {
		const elapsedHrTime = process.hrtime(startHrTime)
		const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6

		debug(req.path, elapsedTimeInMs)
	})

	next()
}

middlewares.use(logResponseTime)
middlewares.use(cookieParser())

middlewares.use(
	cors({
		credentials: true,
		origin: [/localhost/],
	})
)

middlewares.use(
	session({
		store: new RedisStore({
			client: redis,
		}),
		name: 'qid',
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
		},
	})
)

export default middlewares
