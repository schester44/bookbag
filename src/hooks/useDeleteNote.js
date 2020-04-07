import { useMutation } from '@apollo/client'
import { produce } from 'immer'
import { deleteNoteMutation } from '../mutations'
import { bookbagQuery } from '../queries'

export default function useDeleteNote({ id }) {
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
					const noteIndex = draft.notes.findIndex((note) => note.id === id)

					draft.notes.splice(noteIndex, 1)
				}),
			})
		},
	})
}
