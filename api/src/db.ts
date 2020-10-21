import { createConnection as connection } from 'typeorm'

import { User } from './entity/User'
import { NoteBook } from './entity/NoteBook'
import { Note } from './entity/Note'
import { NoteUser } from './entity/NoteUser'
import { BookNote } from './entity/BookNote'

export const createConnection = () => {
	return connection({
		type: 'postgres',
		host: 'localhost',
		username: 'schester',
		password: '',
		database: 'notes',
		entities: [User, NoteBook, Note, NoteUser, BookNote],
		synchronize: true
	})
}
