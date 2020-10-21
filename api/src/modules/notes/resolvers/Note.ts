import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql'
import { Note } from '../../../entity/Note'
import { UpdateNoteInput, CreateNoteInput } from '../types/NoteInput'
import { GQLContext } from '../../../types/GQLContext'
import { getConnection, getRepository } from 'typeorm'
import { BookNote } from '../../../entity/BookNote'
import { NoteUser } from '../../../entity/NoteUser'
import { User } from '../../../entity/User'
import { ForbiddenError } from 'apollo-server-express'

@Resolver()
export class NoteResolver {
	@Query(() => Note, { nullable: true })
	note(@Arg('noteId') id: string): Promise<Note | undefined> {
		// TODO: Ensure the Note belongs to the USER.
		return Note.findOne(id)
	}

	@Query(() => [Note])
	async notes(@Ctx() ctx: GQLContext): Promise<Note[]> {
		const entries = await getRepository(NoteUser)
			.createQueryBuilder('nu')
			.leftJoinAndSelect('nu.note', 'note')
			.leftJoinAndSelect('nu.user', 'user')
			.where('user.id = :userId', {
				userId: ctx.user.id,
			})
			.getMany()

		const notes = []

		for (let entry of entries) {
			notes.push(await entry.note)
		}

		return notes
	}

	@Mutation(() => Note)
	async createNote(@Ctx() ctx: GQLContext, @Arg('input') input: CreateNoteInput): Promise<Note> {
		const note = await Note.create({
			title: input.title ?? '',
			// This could be pretty tough on memory for larger notes
			body: input.body ?? '',
			snippet: input.snippet ?? '',
			owner: ctx.user,
		}).save()

		if (input.notebookId) {
			BookNote.create({ bookId: input.notebookId, noteId: note.id }).save()
		}

		await NoteUser.create({ userId: ctx.user.id, noteId: note.id }).save()

		return note
	}

	@Mutation(() => Note)
	async updateNote(@Arg('noteId') id: string, @Arg('input') input: UpdateNoteInput): Promise<Note> {
		// FIXME: Ensure the Note belongs to the USER.

		await getConnection()
			.createQueryBuilder()
			.update(Note)
			.set(input)
			.where('id = :id', { id })
			.execute()

		return Note.findOne(id)
	}

	@Mutation(() => Boolean)
	async deleteNote(@Arg('noteId') id: string, @Ctx() ctx: GQLContext) {
		console.log(id)

		const note = await Note.findOne({ where: { id, owner: ctx.user } })

		if (!note) throw new ForbiddenError('Note does not exist')

		// to get around foreign key restraints.. FIXME: db constraints
		await NoteUser.delete({ noteId: id })
		await BookNote.delete({ noteId: id })

		await Note.delete({ id })

		return true
	}
}
