import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import Sidebar from 'components/Sidebar'
import EditorWindow from 'components/EditorWindow'
import { bookbagQuery, noteQuery } from 'queries'
import useNewNote from 'hooks/useNewNote'
import { searchIndex } from 'utils/search'

const BookBag = ({ user }) => {
	const { notebookId, noteId } = useParams()
	const [createNewNote] = useNewNote({ notebookId })
	const history = useHistory()
	const activeNote = React.useRef()

	const { loading } = useQuery(bookbagQuery, {
		onCompleted: ({ notes }) => {
			searchIndex.clear()
			notes.forEach((note) => {
				searchIndex.add(note.id, note.title)
				searchIndex.add(note.id, note.body)
			})
		},
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

	// Store the note in a ref so the activeNote persists when changing the route. Without this, the active note would disappear when you change notebooks.
	if (noteQueryData?.note) {
		activeNote.current = noteQueryData?.note
	}

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
		<div className="lg:flex w-full h-full">
			<Sidebar user={user} />
			<EditorWindow activeNote={activeNote.current} isReadOnly={activeNote.current?.trashed} />
		</div>
	)
}

export default BookBag
