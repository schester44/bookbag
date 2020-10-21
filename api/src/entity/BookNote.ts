import { Entity, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'

import { Note } from './Note'
import { NoteBook } from './NoteBook'

@Entity()
export class BookNote extends BaseEntity {
	@PrimaryColumn()
	bookId: string

	@PrimaryColumn()
	noteId: string

	@ManyToOne(() => NoteBook, (book) => book.noteConnection, { primary: true })
	@JoinColumn({ name: 'bookId' })
	notebook: Promise<NoteBook>

	@ManyToOne(() => Note, (note) => note.bookConnection, { primary: true })
	@JoinColumn({ name: 'noteId' })
	note: Promise<Note>
}
