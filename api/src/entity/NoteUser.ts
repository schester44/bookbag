import { Entity, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm'

import { User } from './User'
import { Note } from './Note'

@Entity()
export class NoteUser extends BaseEntity {
	@PrimaryColumn()
	noteId: string

	@PrimaryColumn()
	userId: string

	@ManyToOne((type) => Note, (note) => note.userConnection, { primary: true })
	@JoinColumn({ name: 'noteId' })
	note: Note

	@ManyToOne((type) => User, (user) => user.noteConnection, { primary: true })
	@JoinColumn({ name: 'userId' })
	user: User
}
