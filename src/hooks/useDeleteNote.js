import { useMutation } from '@apollo/client'
import { produce } from 'immer'
import { deleteNoteMutation } from '../mutations'
import { bookbagQuery, notebookQuery } from '../queries'

export default function useDeleteNote({ id, notebookId }) {
	return useMutation(deleteNoteMutation, {
		variables: { id },
		optimisticResponse: {
			__typename: 'Mutation',
			deleteNote: true,
		},
		update: (client) => {
			const data = client.readQuery({
				query: bookbagQuery,
			})

			if (notebookId) {
				const notebookData = client.readQuery({
					query: notebookQuery,
					variables: { id: notebookId },
				})

				client.writeQuery({
					query: notebookQuery,
					variables: { id: notebookId },
					data: produce(notebookData, (draft) => {
						draft.notebook.notes = draft.notebook.notes.filter((note) => note.id !== id)
					}),
				})
			}

			client.writeQuery({
				query: bookbagQuery,
				data: produce(data, (draft) => {
					draft.notes = draft.notes.filter((note) => note.id !== id)

					if (notebookId) {
						const idx = draft.notebooks.findIndex((book) => book.id === notebookId)

						if (idx > -1) {
							draft.notebooks[idx].notes = draft.notebooks[idx].notes.filter(
								(note) => note.id !== id
							)
						}
					}
				}),
			})
		},
	})
}
