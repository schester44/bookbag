import React from 'react'
import { useParams } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import Sidebar from 'components/Sidebar'
import EditorWindow from 'components/EditorWindow'
import { bookbagQuery, noteQuery } from 'queries'

const BookBag = ({ user }) => {
	const { notebookId, noteId } = useParams()

	const { data, loading } = useQuery(bookbagQuery, {
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
		function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			// TODO: does this work on Windows?
			if (event.ctrlKey && event.key === 'n') {
				// dispatch(openNewNote({ notebookId }))
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [notebookId])

	if (loading) return <div>loading...</div>

	console.log({ activeNote })
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
