import React from 'react'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { produce } from 'immer'

import { bookbagQuery } from 'queries'
import { createNoteBookMutation, createNoteMutation } from 'mutations'

const Heading = () => {
	const [createNoteBook] = useMutation(createNoteBookMutation)
	const [createNote] = useMutation(createNoteMutation)

	const history = useHistory()

	const [state, setState] = React.useState({
		newBookInputVisible: false,
		newBookName: '',
	})

	const handleNewBookInputKeyDown = async (e) => {
		if (e.key === 'Escape') {
			return setState((prev) => ({ ...prev, newBookInputVisible: false, newBookName: '' }))
		}

		// save
		if (e.key !== 'Enter' || state.newBookName.trim().length === 0) return

		const name = state.newBookName

		setState((prev) => ({ ...prev, newBookInputVisible: false, newBookName: '' }))

		const { data: notebookData } = await createNoteBook({
			variables: {
				name,
			},
			update: (cache, { data: { createNoteBook } }) => {
				const data = cache.readQuery({ query: bookbagQuery })

				cache.writeQuery({
					query: bookbagQuery,
					data: produce(data, (draft) => {
						draft.notebooks.push({ ...createNoteBook, notes: [] })
					}),
				})
			},
		})

		const { data: noteData } = await createNote({
			variables: {
				input: {
					notebookId: notebookData.createNoteBook.id,
					title: '',
					snippet: '',
					body: '',
				},
			},
			update: (client, { data: { createNote: createdNote } }) => {
				const bookbag = client.readQuery({ query: bookbagQuery })

				const data = {
					notebooks: bookbag.notebooks.map((book) => {
						if (book.id !== notebookData.createNoteBook.id) return book

						return { ...book, notes: [createdNote, ...book.notes] }
					}),
					notes: [createdNote, ...bookbag.notes],
				}

				client.writeQuery({ query: bookbagQuery, data })
			},
		})

		history.push(`/notebook/${notebookData.createNoteBook.id}/${noteData.createNote.id}`)
	}

	const handleNewBookInputChange = ({ target: { value } }) => {
		setState((prev) => ({ ...prev, newBookName: value }))
	}

	return (
		<div>
			{!state.newBookInputVisible ? (
				<div
					className="text-white px-4 py-2 mt-1 flex text-sm items-center cursor-auto"
					onClick={() => setState((prev) => ({ ...prev, newBookInputVisible: true }))}
				>
					<FaPlus />
					<span className="ml-3">New NoteBook...</span>
				</div>
			) : (
				<div className="py-2 px-2">
					<input
						autoFocus
						className="w-full rounded-full border border-gray-600 px-2 py-1 text-sm bg-transparent text-white outline-none"
						type="text"
						value={state.newBookName}
						onKeyDown={handleNewBookInputKeyDown}
						onChange={handleNewBookInputChange}
					/>
				</div>
			)}
		</div>
	)
}

export default Heading
