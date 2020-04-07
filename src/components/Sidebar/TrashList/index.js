import React from 'react'
import { useQuery } from '@apollo/client'
import TrashedNote from './TrashedNote'
import { Link, useParams } from 'react-router-dom'

import { bookbagQuery } from 'queries'

const NotesList = () => {
	const { data, loading } = useQuery(bookbagQuery)
	const { noteId } = useParams()

	const trash = React.useMemo(() => {
		return !data?.notes ? [] : data.notes.filter((note) => note.trashed)
	}, [data])

	if (loading) return <div>LOADING</div>

	return (
		<div>
			{trash.map((note) => {
				return (
					<Link to={`/trash/${note.id}`} key={note.id}>
						<TrashedNote
							key={note.id}
							note={note}
							trashedAt={note.updatedAt}
							isSelected={noteId === note.id}
						/>
					</Link>
				)
			})}

			{trash.length === 0 && (
				<p className="m-4 text-center text-sm text-gray-400">Trash is empty</p>
			)}
		</div>
	)
}

export default NotesList
