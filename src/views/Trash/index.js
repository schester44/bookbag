import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GoNote } from 'react-icons/go'
import { MdSettingsBackupRestore } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'

import { fetchTrash, restoreFromTrash, deleteTrashedNote } from '../../actions/trash'
import { formatDistanceToNow } from 'date-fns/esm'

const trashSelector = state => state.trash

const Trash = () => {
	const dispatch = useDispatch()
	const trash = useSelector(trashSelector)

	React.useEffect(() => {
		dispatch(fetchTrash())
	}, [dispatch])

	const handleDelete = note => {
		dispatch(deleteTrashedNote({ noteId: note.id }))
	}

	const handleRestore = note => {
		dispatch(restoreFromTrash({ noteId: note.id }))
	}

	if (trash.ids.length === 0)
		return (
			<div className="bg-gray-100 flex-1 px-2 pt-4 text-gray-900 h-full">
				<div className=" container mx-auto h-full flex items-center justify-center flex-col">
					<FiTrash2 className="text-4xl text-gray-600" />
					<span className="text-3xl text-gray-600 font-thin">Trash is empty</span>
				</div>
			</div>
		)

	return (
		<div className="bg-gray-100 overflow-auto  flex-1 px-2 pt-8 pb-24 text-gray-900">
			<div className=" container mx-auto">
				<h1 className="text-3xl font-bold pb-1 mb-4">Trash</h1>

				<div>
					{trash.ids.map(id => {
						const { note, trashedAt } = trash.idMap[id]

						return (
							<div
								className={`text-xl flex border-b border-gray-200 mb-2 rounded items-center justify-between px-4 py-4`}
								key={id}
							>
								<div className="flex justify-between items-center">
									<div className="text-gray-400 text-4xl mr-4">
										<GoNote />
									</div>

									<div>
										<p className="leading-tight">
											{note.title.trim().length > 0 ? (
												note.title
											) : (
												<span className="italic text-gray-500 font-thin">Untitled Note</span>
											)}
										</p>
										<p className="text-sm text-gray-400">
											Sent to trash {formatDistanceToNow(trashedAt)} ago
										</p>
									</div>
								</div>

								<div className="flex items-center text-2xl">
									<div
										className="mx-1 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
										onClick={() => handleRestore(note)}
									>
										<MdSettingsBackupRestore />
									</div>

									<div
										className="mx-1 text-red-700 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
										onClick={() => handleDelete(note)}
									>
										<FiTrash2 />
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Trash
