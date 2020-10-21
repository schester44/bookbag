import { Entity, Column, BaseEntity, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm'

import { v4 as uuidv4 } from 'uuid'
import { Note } from './Note'
import { NoteUser } from './NoteUser'
import { NoteBook } from './NoteBook'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn('uuid')
	id: string

	@Field()
	@Column({ type: 'citext', unique: true })
	username: string

	@Column({ type: 'varchar', length: '255', nullable: true })
	password: string

	@Column({ type: 'jsonb', nullable: true })
	accountSettings?: any

	@OneToMany((type) => Note, (note) => note.owner)
	notes?: Note[]

	@OneToMany((type) => NoteUser, (nu) => nu.user)
	noteConnection?: Note

	@OneToMany((type) => NoteBook, (book) => book.user)
	notebooks?: NoteBook[]

	@BeforeInsert()
	addId() {
		this.id = uuidv4()
	}
}
