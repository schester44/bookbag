import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import Sidebar from 'components/Sidebar'
import EditorWindow from 'components/EditorWindow'
import { bookbagQuery, noteQuery } from 'queries'
import useNewNote from 'hooks/useNewNote'

const BookBag = ({ user }) => {
	const { notebookId, noteId } = useParams()
	const [createNewNote] = useNewNote({ notebookId })
	const history = useHistory()

	const { loading } = useQuery(bookbagQuery, {
		returnPartialData: true,
		variables: {
			id: noteId,
		},
	})

	const { data: noteQueryData } = useQuery(noteQuery, {
		skip: !noteId,
		variables: {
			id: noteId,
		},
	})

	const activeNote = noteQueryData?.note

	React.useEffect(() => {
		async function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			// TODO: does this work on Windows?
			if (event.ctrlKey && event.key === 'n') {
				const { data } = await createNewNote({ variables: { notebookId } })

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

	if (loading) return <div>loading...</div>

	return (
		<div className="flex w-full h-full">
			<Sidebar user={user} />
			<EditorWindow
				activeNote={activeNote}
				// isReadOnly={match.path === '/trash/:noteId'}
			/>
		</div>
	)
}

export default BookBag
