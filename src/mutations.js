import { gql } from '@apollo/client'
import { NoteParts } from './queries'

export const loginMutation = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
		}
	}
`

export const updateNoteMutation = gql`
	mutation updateNote($id: String!, $input: UpdateNoteInput!) {
		updateNote(noteId: $id, input: $input) {
			...NoteParts
		}
	}

	${NoteParts}
`

export const createNoteMutation = gql`
	mutation createNote($input: CreateNoteInput!) {
		createNote(input: $input) {
			...NoteParts
		}
	}

	${NoteParts}
`

export const createNoteBookMutation = gql`
	mutation createNoteBook($name: String!) {
		createNoteBook(name: $name) {
			id
			name
		}
	}
`

export const deleteNoteMutation = gql`
	mutation deleteNote($id: String!) {
		deleteNote(noteId: $id)
	}
`

export const deleteNoteBookMutation = gql`
	mutation deleteNoteBookMutation($id: String!) {
		deleteNoteBook(bookId: $id)
	}
`

export const updateNoteBookMutation = gql`
	mutation updateNoteBook($id: String!, $name: String!) {
		updateNoteBook(noteId: $id, name: $name) {
			id
			name
		}
	}
`

export const addNoteToBookMutation = gql`
	mutation addNoteToBook($bookId: String!, $noteId: String!) {
		addNoteToBook(bookId: $bookId, noteId: $noteId)
	}
`
