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
	mutation createNote($notebookId: String) {
		createNote(notebookId: $notebookId) {
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
