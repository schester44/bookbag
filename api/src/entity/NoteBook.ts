import {
	Entity,
	Column,
	BaseEntity,
	PrimaryColumn,
	BeforeInsert,
	OneToMany,
	ManyToMany,
	ManyToOne,
	getRepository,
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'
import { User } from './User'
import { BookNote } from './BookNote'
import { ObjectType, Field, ID } from 'type-graphql'
import { Note } from './Note'

@ObjectType()
@Entity({ name: 'notebook' })
export class NoteBook extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn('uuid')
	id: string

	@Field()
	@Column({ type: 'varchar', length: '255', nullable: false })
	name: string

	@Field(() => User)
	@ManyToOne((type) => User, (user) => user.notebooks)
	user: User

	@OneToMany(() => BookNote, (bn) => bn.notebook)
	noteConnection: Promise<BookNote[]>

	@Field(() => [Note])
	async notes(): Promise<Note[]> {
		const bookNotes = await getRepository(BookNote)
			.createQueryBuilder('bookNote')
			.innerJoinAndSelect('bookNote.note', 'y')
			.where('bookNote.bookId = :id', {
				id: this.id,
			})
			.getMany()

		let notes: Note[] = []

		for (let bookNote of bookNotes) {
			notes.push(await bookNote.note)
		}

		return notes
	}

	@BeforeInsert()
	addId() {
		this.id = uuidv4()
	}
}
