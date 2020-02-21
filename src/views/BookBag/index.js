import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { openNewNote } from '../../entities/notes/actions'
import { initBookBag } from '../../entities/bookbag/actions'

import Sidebar from '../../components/Sidebar'
import EditorWindow from '../../components/EditorWindow'

const Notepad = () => {
	const dispatch = useDispatch()
	const { notebookId, noteId } = useParams()

	React.useEffect(() => {
		dispatch(initBookBag({ notebookId, noteId }))
	}, [dispatch, notebookId, noteId])

	React.useEffect(() => {
		function hotKeyListener(event) {
			// TODO: Why doesn't isHotKey work here
			if (event.ctrlKey && event.key === 'n') {
				dispatch(openNewNote())
			}
		}

		document.addEventListener('keypress', hotKeyListener)

		return () => document.removeEventListener('keypress', hotKeyListener)
	}, [dispatch])

	return (
		<div className="flex w-full h-full">
			<Sidebar />
			<EditorWindow />
		</div>
	)
}

export default Notepad
