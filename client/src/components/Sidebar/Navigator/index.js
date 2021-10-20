import React from 'react'
import { useQuery } from '@apollo/client'
import { FiUser } from 'react-icons/fi'

import Notebooks from './Notebooks'
import AllNotes from './AllNotesLink'
import Trash from './TrashLink'

import { bookbagQuery } from 'queries'
import Dropdown from 'components/Dropdown'
import { DropdownMenu } from 'components/DropdownMenu'
import { MenuItem } from 'components/ContextMenu'
import { useHistory } from 'react-router'

const Navigator = ({ user }) => {
	const isLoggedIn = !!user

	const { data, loading } = useQuery(bookbagQuery, {
		skip: !isLoggedIn,
	})

	const history = useHistory()

	const { totalNotes, totalNotebooks, totalTrash } = React.useMemo(() => {
		if (!isLoggedIn) {
			// TODO: Fetch these numbers from localStorage
			// TODO: Which indexDB to use? RxDB?
			return { totalNotes: 0, totalNotebooks: 0, totalTrash: 0 }
		}

		if (isLoggedIn && (loading || !data)) return {}

		const totalTrash = data.notes.filter((note) => note.trashed)

		return {
			totalNotes: data.notes.length - totalTrash.length,
			totalTrash: totalTrash.length,
			totalNotebooks: data?.notebooks.length || 0,
		}
	}, [data, loading, isLoggedIn])

	const notebooks = React.useMemo(() => {
		if (isLoggedIn) return data?.notebooks || []

		// TODO: Get notebooks from indexDB
		return []
	}, [data, isLoggedIn])
	if (isLoggedIn && (loading || !data)) return null

	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<AllNotes totalNotes={totalNotes} />
				<Trash totalNotes={totalTrash} />
				<Notebooks notebooks={notebooks} totalBooks={totalNotebooks} />
			</div>
			<div>
				<Dropdown
					placement="bottomRight"
					content={
						user ? (
							<DropdownMenu>
								<MenuItem
									onClick={(x) => {
										history.push('/settings')
									}}
								>
									Settings
								</MenuItem>
								<MenuItem>Logout</MenuItem>
							</DropdownMenu>
						) : (
							<DropdownMenu>
								<MenuItem>Create account</MenuItem>
							</DropdownMenu>
						)
					}
				>
					<div className="flex items-center px-2 py-4 text-white text-sm ml-3 cursor-pointer">
						<FiUser className="text-xl mr-2" /> {user?.username || 'Guest'}
					</div>
				</Dropdown>
			</div>
		</div>
	)
}

export default Navigator
