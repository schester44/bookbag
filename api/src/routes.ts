import { Express } from 'express'

import * as auth from './modules/authentication'
import * as user from './modules/user'
import * as notes from './modules/notes'
import * as notebooks from './modules/notebooks'

import { isAuthenticated } from './modules/middlewares/isAuthenticated'

export const registerRoutes = (app: Express) => {
	app.get('/me', isAuthenticated, user.me)
	app.post('/auth/register', auth.registerUser)
	app.post('/auth/login', auth.login)
	app.post('/auth/logout', auth.logout)

	app.get('/notes', isAuthenticated, notes.getAllNotes)
	app.post('/notes', isAuthenticated, notes.createNote)
	app.put('/notes/:id', isAuthenticated, notes.updateNote)
	app.delete('/notes/:id', isAuthenticated, notes.deleteNote)

	app.get('/notebooks', isAuthenticated, notebooks.getAllNoteBooks)
	app.post('/notebooks', isAuthenticated, notebooks.createNoteBook)
	app.put('/notebooks/:id', isAuthenticated, notebooks.updateNoteBook)
	app.delete('/notebooks/:id', isAuthenticated, notebooks.deleteNoteBook)
}
