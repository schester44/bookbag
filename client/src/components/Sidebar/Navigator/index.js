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
	const { data, loading } = useQuery(bookbagQuery, {
		onCompleted: () => {
			console.log('we render a lot')
		},
	})
	const history = useHistory()

	const { totalNotes, totalNotebooks, totalTrash } = React.useMemo(() => {
		if (loading || !data) return {}

		const totalTrash = data.notes.filter((note) => note.trashed)

		return {
			totalNotes: data.notes.length - totalTrash.length,
			totalTrash: totalTrash.length,
			totalNotebooks: data?.notebooks.length || 0,
		}
	}, [data, loading])

	if (loading || !data) return null

	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<AllNotes totalNotes={totalNotes} />
				<Trash totalNotes={totalTrash} />
				<Notebooks notebooks={data.notebooks} totalBooks={totalNotebooks} />
			</div>
			<div>
				{user && (
					<Dropdown
						placement="bottomRight"
						content={
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
						}
					>
						<div className="flex items-center px-2 py-4 text-white text-sm ml-3">
							<FiUser className="text-xl mr-2" /> {user.username}
						</div>
					</Dropdown>
				)}
			</div>
		</div>
	)
}

export default Navigator
