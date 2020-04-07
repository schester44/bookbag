import React from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { FiSettings } from 'react-icons/fi'

import Notebooks from './Notebooks'
import AllNotes from './AllNotesLink'
import Trash from './TrashLink'

import { bookbagQuery } from 'queries'

const Navigator = ({ user }) => {
	const { data } = useQuery(bookbagQuery)

	const { totalNotes, totalNotebooks, totalTrash } = React.useMemo(() => {
		const totalTrash = data.notes.filter((note) => note.trashed)

		return {
			totalNotes: data.notes.length - totalTrash.length,
			totalTrash: totalTrash.length,
			totalNotebooks: data?.notebooks.length || 0,
		}
	}, [data])

	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<AllNotes totalNotes={totalNotes} />
				<Notebooks notebooks={data.notebooks} totalBooks={totalNotebooks} />
				<Trash totalNotes={totalTrash} />
			</div>
			<div>
				{user && <div className="px-2 py-4 text-white text-sm">Logged in as {user.username}</div>}

				<NavLink to="/settings" className={'navigator-link flex items-center justify-between'}>
					<div className="flex items-center">
						<FiSettings />
						<span className="ml-3">Settings</span>
					</div>
				</NavLink>
			</div>
		</div>
	)
}

export default Navigator
