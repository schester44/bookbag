import React from 'react'
import { useParams, useHistory, useRouteMatch, generatePath } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { TiPlus } from 'react-icons/ti'
import SearchBar from './SearchBar'
import Note from './Note'

import { bookbagQuery, notebookQuery } from 'queries'
import useNewNote from 'hooks/useNewNote'
import { searchIndex } from 'utils/search'
import { encrypt, SECRET } from 'utils/encryption'

const NotesList = () => {
	const { notebookId, noteId } = useParams()
	const [createNote] = useNewNote({ notebookId })
	const [search, setSearch] = React.useState({
		term: '',
		results: [],
	})

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

	const notebookNotes = data?.notes

	const notes = React.useMemo(() => {
		const notes = notebook?.notes || notebookNotes

		return notes ? notes.filter((note) => !note.trashed) : []
	}, [notebook, notebookNotes])

	const history = useHistory()
	const match = useRouteMatch()

	const handleNoteSelection = (note) => {
		// this note is already selected
		if (note.id === noteId) return

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
		const { data } = await createNote({
			variables: {
				input: {
					notebookId,
					body: encrypt(
						JSON.stringify([
							{
								type: 'paragraph',
								children: [{ text: '' }],
							},
						]),
						SECRET
					),
				},
			},
		})

		const note = data.createNote

		const pathname = notebookId ? `/notebook/${notebookId}/${note.id}` : `/note/${note.id}`

		history.push({
			pathname,
			from: history.location,
		})
	}

	const handleSearch = async (term) => {
		const results = await searchIndex.search(term)

		// TODO: Move this somewhere better. doesn't need ran every search
		const notesById = notes.reduce((acc, note) => {
			acc[note.id] = note

			return acc
		}, {})

		setSearch({ term, results: results.map((id) => notesById[id]) })
	}

	const isSearching = search.term.length > 0

	return (
		<div className="h-full flex flex-col">
			<div className="mb-2 px-2 w-full pb-2 pt-1 flex">
				<div style={{ width: 'calc(100% - 40px)' }}>
					<SearchBar value={search.term} onSearch={handleSearch} onTagChange={console.log} />
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
				{isSearching ? 'Search Results' : notebook ? notebook.name : 'All Notes'}
			</p>

			<div className="flex-1 overflow-auto">
				{(isSearching ? search.results : notes).map((note) => {
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

				{isSearching && search.results.length === 0 && (
					<p className="m-4 text-center text-sm text-gray-400">No results found</p>
				)}
			</div>
		</div>
	)
}

export default NotesList
