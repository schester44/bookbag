import { gql } from '@apollo/client'

export const noteTitleFragment = gql`
	fragment NoteTitle on Note {
		title
	}
`

export const NoteParts = gql`
	fragment NoteParts on Note {
		id
		title
		snippet
		body
		trashed
		createdAt
		updatedAt
	}
`

export const bookNotesFragment = gql`
	fragment BookNotes on NoteBook {
		notes {
			...NoteParts
		}
	}

	${NoteParts}
`

export const userQuery = gql`
	{
		me {
			id
			username
		}
	}
`

export const bookbagQuery = gql`
	{
		notebooks {
			id
			name

			notes {
				...NoteParts
			}
		}

		notes {
			...NoteParts
		}
	}

	${NoteParts}
`

export const noteQuery = gql`
	query note($id: String!) {
		note(noteId: $id) {
			...NoteParts
		}
	}
	${NoteParts}
`

export const notebookQuery = gql`
	query notebook($id: String!) {
		notebook(bookId: $id) {
			id
			name

			notes {
				...NoteParts
			}
		}
	}

	${NoteParts}
`
