import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useRouteMatch } from 'react-router-dom'

import { openNewNote } from '../../entities/notes/actions'
import { initBookBag } from '../../entities/bookbag/actions'

import Sidebar from '../../components/Sidebar'
import EditorWindow from '../../components/EditorWindow'

const Notepad = () => {
	const dispatch = useDispatch()
	const { notebookId, noteId } = useParams()
	const match = useRouteMatch()

	React.useEffect(() => {
		dispatch(initBookBag({ notebookId, noteId }))
	}, [dispatch, notebookId, noteId])

	React.useEffect(() => {
		function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			// TODO: does this work on Windows?
			if (event.ctrlKey && event.key === 'n') {
				dispatch(openNewNote({ notebookId }))
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [dispatch, notebookId])

	return (
		<div className="flex w-full h-full">
			<Sidebar />
			<EditorWindow isReadOnly={match.path === '/trash/:noteId'} />
		</div>
	)
}

export default Notepad
