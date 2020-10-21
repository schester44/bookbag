import {
	Entity,
	Column,
	BaseEntity,
	PrimaryColumn,
	BeforeInsert,
	ManyToOne,
	OneToMany,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm'

import { v4 as uuidv4 } from 'uuid'
import { User } from './User'
import { NoteUser } from './NoteUser'
import { BookNote } from './BookNote'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity()
export class Note extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn('uuid')
	id: string

	@Field()
	@Column({ type: 'varchar', length: 255, nullable: false })
	title: string

	@Field()
	@Column({ type: 'varchar', length: 255, nullable: true })
	snippet?: string

	@Field()
	@Column({ type: 'text', nullable: true })
	body: string

	@Field()
	@Column({ type: 'boolean', nullable: false, default: false })
	trashed: boolean

	@ManyToOne((type) => User, (user) => user.notes, { onDelete: 'CASCADE' })
	owner: User

	@OneToMany(() => BookNote, (bn) => bn.note, { onDelete: 'CASCADE' })
	bookConnection: Promise<BookNote[]>

	@OneToMany((type) => NoteUser, (nu) => nu.user, { onDelete: 'CASCADE' })
	userConnection: Promise<User>

	@Field(() => Date)
	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	createdAt: Date

	@Field(() => Date)
	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date

	@BeforeInsert()
	addId() {
		this.id = uuidv4()
	}
}
