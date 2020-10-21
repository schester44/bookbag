import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql'
import { Note } from '../../../entity/Note'
import { GQLContext } from '../../../types/GQLContext'
import { NoteBook } from '../../../entity/NoteBook'
import { getConnection, getRepository } from 'typeorm'
import { BookNote } from '../../../entity/BookNote'

@Resolver()
export class NoteBookResolver {
	@Query(() => NoteBook, {
		nullable: true,
	})
	notebook(@Arg('bookId') id: string): Promise<NoteBook | undefined> {
		return NoteBook.findOne(id)
	}

	@Query(() => [NoteBook])
	async notebooks(@Ctx() ctx: GQLContext): Promise<NoteBook[]> {
		const books = await NoteBook.find({
			where: {
				user: ctx.user.id,
			},
		})

		console.log({ books })

		return books
	}

	@Mutation(() => NoteBook)
	createNoteBook(@Arg('name') name: string, @Ctx() ctx: GQLContext): Promise<NoteBook> {
		return NoteBook.create({ name, user: ctx.user }).save()
	}

	@Mutation(() => NoteBook)
	async updateNoteBook(@Arg('noteId') id: string, @Arg('name') name: string): Promise<NoteBook> {
		const notebook = await NoteBook.findOne({ where: { id } })

		notebook.name = name

		await notebook.save()

		return notebook
	}

	@Mutation(() => Boolean)
	async addNoteToBook(
		@Arg('noteId') noteId: string,
		@Arg('bookId') bookId: string,
		@Ctx() ctx: GQLContext
	): Promise<boolean> {
		const existing = await getRepository(BookNote)
			.createQueryBuilder('bn')
			.leftJoinAndSelect('bn.notebook', 'notebook')
			.leftJoinAndSelect('bn.note', 'note')
			.where('note.id = :noteId AND notebook.user = :userId', {
				noteId,
				userId: ctx.user.id,
			})
			.getOne()

		if (existing) {
			await existing.remove()
		}
		await BookNote.create({ noteId, bookId }).save()

		return true
	}

	async removeNoteFromBook(
		@Arg('noteId') noteId: string,
		@Arg('bookId') bookId: string
	): Promise<boolean> {
		await getConnection()
			.createQueryBuilder()
			.delete()
			.from(BookNote)
			.where('bookId = :bookId and noteId = :noteId', { bookId, noteId })
			.execute()

		return true
	}

	@Mutation(() => Boolean)
	async deleteNoteBook(@Arg('bookId') id: string) {
		await BookNote.delete({ bookId: id })

		await getConnection()
			.createQueryBuilder()
			.delete()
			.from(NoteBook)
			.where('id = :id', { id })
			.execute()

		return true
	}
}
