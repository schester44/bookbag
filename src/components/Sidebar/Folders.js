import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoNote } from 'react-icons/go'
import { TiArrowUnsorted } from 'react-icons/ti'

const Folders = () => {
	return (
		<div className="w-2/5 bg-gray-100 border-r border-gray-300">
			<p className="px-4 my-2 font-semibold text-gray-700">Folders</p>

			<NavLink
				to="/"
				className="folder-link px-4 py-1 flex items-center hover:bg-gray-200 cursor-pointer"
			>
				<GoNote />
				<span className="ml-2">All Notes</span>
			</NavLink>

			<div className="folder-link px-4 py-1 flex items-center hover:bg-gray-200 cursor-pointer">
				<TiArrowUnsorted />
				<span className="ml-2">Unsorted Notes</span>
			</div>
		</div>
	)
}

export default Folders
