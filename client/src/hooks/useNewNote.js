import { useMutation } from '@apollo/client'

import { createNoteMutation } from '../mutations'
import { bookbagQuery } from '../queries'

export default function useNewNote({ notebookId } = {}) {
	return useMutation(createNoteMutation, {
		update: (client, { data: { createNote: createdNote } }) => {
			const bookbag = client.readQuery({ query: bookbagQuery })

			const notebooks = !notebookId
				? bookbag.notebooks
				: bookbag.notebooks.map((book) => {
						if (book.id !== notebookId) return book

						return { ...book, notes: [createdNote, ...book.notes] }
				  })

			const data = {
				notebooks,
				notes: [createdNote, ...bookbag.notes],
			}

			client.writeQuery({
				query: bookbagQuery,
				data,
			})
		},
	})
}
