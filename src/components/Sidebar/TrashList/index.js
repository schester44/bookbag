import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TrashedNote from './TrashedNote'
import { fetchTrash } from '../../../entities/trash/actions'
import { Link, useParams } from 'react-router-dom'

const trashSelector = state => state.trash

const NotesList = () => {
	const dispatch = useDispatch()
	const trash = useSelector(trashSelector)
	const { noteId } = useParams()

	React.useEffect(() => {
		dispatch(fetchTrash())
	}, [dispatch])

	return (
		<div>
			{trash.ids.map(id => {
				const { note, trashedAt } = trash.idMap[id]

				return (
					<Link to={`/trash/${note.id}`} key={id}>
						<TrashedNote
							key={id}
							note={note}
							trashedAt={trashedAt}
							isSelected={noteId === note.id}
						/>
					</Link>
				)
			})}

			{trash.ids.length === 0 && (
				<p className="m-4 text-center text-sm text-gray-400">Trash is empty</p>
			)}
		</div>
	)
}

export default NotesList
