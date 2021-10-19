import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import Sidebar from 'components/Sidebar'
import EditorWindow from 'components/EditorWindow'
import { bookbagQuery, notebookQuery, noteQuery } from 'queries'
import useNewNote from 'hooks/useNewNote'
import { searchIndex } from 'utils/search'
import { Helmet } from 'react-helmet'
import { GoNote } from 'react-icons/go'

const BookBag = ({ user }) => {
	const { notebookId, noteId } = useParams()
	const [createNewNote] = useNewNote({ notebookId })
	const history = useHistory()

	const { loading } = useQuery(bookbagQuery, {
		onCompleted: ({ notes }) => {
			notes.forEach((note) => {
				searchIndex.add(note.id, note.title)
				searchIndex.add(note.id, note.body)
			})
		},
		variables: {
			id: noteId,
		},
	})

	const { data: notebookData } = useQuery(notebookQuery, {
		skip: !notebookId,
		variables: {
			id: notebookId,
		},
	})

	const { data: noteQueryData } = useQuery(noteQuery, {
		skip: !noteId,
		variables: {
			id: noteId,
		},
	})

	React.useEffect(() => {
		async function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			// TODO: does this work on Windows?
			if (event.ctrlKey && event.key === 'n') {
				const { data } = await createNewNote({
					variables: {
						input: {
							notebookId,
							title: '',
							snippet: '',
							body: '',
						},
					},
				})

				// TODO: Move these paths to a global file
				const pathname = notebookId
					? `/notebook/${notebookId}/${data.createNote.id}`
					: `/note/${data.createNote.id}`

				history.push({
					pathname,
					state: {
						from: history.location,
					},
				})
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [notebookId, history, createNewNote])

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<GoNote className=" text-indigo-500" style={{ fontSize: 150 }} />
			</div>
		)
	}

	return (
		<div className="flex lg:flex-row flex-col w-full h-full">
			<Helmet>{notebookData && <title>{notebookData?.notebook.name} Notes</title>}</Helmet>
			<Sidebar user={user} />
			<EditorWindow activeNote={noteQueryData?.note} isReadOnly={noteQueryData?.note?.trashed} />
		</div>
	)
}

export default BookBag
