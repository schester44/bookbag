import React from 'react'
import { FiTrash } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

import { formatDistanceToNow } from 'date-fns/esm'
import { MdSettingsBackupRestore } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'

import { restoreFromTrash, deleteTrashedNote } from '../../../entities/trash/actions'

const TrashedNote = ({ note, trashedAt }) => {
	const dispatch = useDispatch()

	const handleDelete = note => {
		dispatch(deleteTrashedNote({ noteId: note.id }))
	}

	const handleRestore = note => {
		dispatch(restoreFromTrash({ noteId: note.id }))
	}

	return (
		<div className="sidebar-note border-b border-gray-300 pt-3 px-4 pb-4">
			<div className="flex items-center pb-2 justify-between">
				<div className="text-gray-400 text-xl">
					<FiTrash />
				</div>

				<div className="flex items-center">
					<p className="text-right leading-none text-xs text-gray-400">
						Sent to trash {formatDistanceToNow(trashedAt)} ago
					</p>
				</div>
			</div>

			<div className=" flex items-center justify-between">
				<div>
					<p
						className="ml-6"
						style={{
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical'
						}}
					>
						{note.title.trim().length > 0 ? (
							note.title
						) : (
							<span className="text-gray-600 italic">Untitled Note</span>
						)}
					</p>

					<p
						className="pl-6 truncate text-sm text-gray-500"
						style={{ maxWidth: 290 }}
					>
						{note.snippet?.trim().length > 0 ? (
							note.snippet
						) : (
							<span className="italic">empty note</span>
						)}
					</p>
				</div>

				<div className="flex items-center">
					<div
						className="bg-gray-200 px-2 py-2 hover:bg-gray-300 rounded cursor-pointer"
						onClick={() => handleRestore(note)}
					>
						<MdSettingsBackupRestore />
					</div>

					<div
						className="ml-1 text-red-700 bg-gray-200 px-2 py-2 hover:bg-gray-300 rounded cursor-pointer"
						onClick={() => handleDelete(note)}
					>
						<FiTrash2 />
					</div>
				</div>
			</div>
		</div>
	)
}

export default TrashedNote
