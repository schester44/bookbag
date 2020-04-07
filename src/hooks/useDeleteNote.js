import { useMutation } from '@apollo/client'
import { produce } from 'immer'
import { deleteNoteMutation } from '../mutations'
import { bookbagQuery } from '../queries'

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

			// TODO: Clean up parent Notebook, or evict/expire or whatever
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
