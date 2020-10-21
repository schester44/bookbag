import { Note } from '../../entity/Note'

import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middlewares/isAuthenticated'
import { getConnection } from 'typeorm'

export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
	// FIXME; Limit by req.user.id
	const notes = await Note.find()

	res.send({ notes })
}

export const createNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const { title, snippet, body } = req.body

	const owner = req.user

	const note = await Note.create({
		title,
		snippet,
		body,
		owner
	}).save()

	res.send({ note })
}

export const updateNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const { id } = req.params
	const { title, body, snippet, trashed } = req.body

	const note = await Note.findOne({ where: { id } })
	// TODO: Handle error

	Object.keys({ title, body, snippet, trashed }).forEach(key => {
		if (typeof req.body[key] !== 'undefined') {
			note[key] = req.body[key]
		}
	})

	await note.save()

	res.send({ note })
}

export const deleteNote = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const { id } = req.params

	await getConnection()
		.createQueryBuilder()
		.delete()
		.from(Note)
		.where('id = :id', { id })
		.execute()

	res.sendStatus(204)
}
