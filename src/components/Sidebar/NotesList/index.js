import React from 'react'
import { useParams, useHistory, useRouteMatch, generatePath } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'

import { TiPlus } from 'react-icons/ti'
import SearchBar from './SearchBar'
import Note from './Note'

import { bookbagQuery, notebookQuery } from 'queries'
import useNewNote from 'hooks/useNewNote'

const NotesList = () => {
	const { notebookId, noteId } = useParams()
	const [createNote] = useNewNote({ notebookId })

	const { data } = useQuery(bookbagQuery, {
		variables: {
			notebookId,
		},
	})

	const { data: notebookData } = useQuery(notebookQuery, {
		skip: !notebookId,
		variables: {
			id: notebookId,
		},
	})

	const notebook = notebookData?.notebook
	const notebooks = data?.notebooks

	const notes = React.useMemo(() => {
		const notes = notebook?.notes || data.notes

		return notes ? notes.filter((note) => !note.trashed) : []
	}, [notebook, data.notes])

	const history = useHistory()
	const match = useRouteMatch()

	const handleNoteSelection = (note) => {
		// this note is already selected
		if (note.id === noteId) return

		// TODO: get note tags
		// dispatch(fetchNoteTags(note.id))

		let pathname = `/note/${note.id}`

		if (match.params.notebookId) {
			pathname = generatePath(match.path, { ...match.params, noteId: note.id })
		}

		history.push({
			pathname,
			state: {
				from: history.location,
			},
		})
	}

	const handleNewNote = async () => {
		const { data } = await createNote({ variables: { notebookId } })

		const note = data.createNote

		const pathname = notebookId ? `/notebook/${notebookId}/${note.id}` : `/note/${note.id}`

		history.push({
			pathname,
			from: history.location,
		})
	}

	return (
		<div>
			<div className="mb-2 px-2 w-full pb-2 pt-1 flex">
				<div style={{ width: 'calc(100% - 40px)' }}>
					<SearchBar value={''} onSearch={console.log} onTagChange={console.log} />
				</div>
				<div>
					<div
						onClick={handleNewNote}
						className="flex items-center ml-2 rounded bg-gray-300 py-2 px-2 text-gray-600 font-bold cursor-pointer hover:text-gray-700"
					>
						<TiPlus />
					</div>
				</div>
			</div>

			<p className="px-4 mb-2 font-semibold text-gray-700">
				{notebook ? notebook.name : 'All Notes'}
			</p>

			{notes.map((note) => {
				return (
					<Note
						key={note.id}
						note={note}
						isSelected={noteId === note.id}
						onSelect={handleNoteSelection}
					/>
				)
			})}

			{notebook && notes.length === 0 && (
				<p className="m-4 text-center text-sm text-gray-400">This notebook is empty</p>
			)}

			<p className="m-4 text-center text-sm text-gray-400">
				<span className="font-bold">control + n</span> for a new note
			</p>
		</div>
	)
}

export default NotesList
