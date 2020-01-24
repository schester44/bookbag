import React from 'react'
import { GoNote } from 'react-icons/go'
import { FiHash, FiSettings } from 'react-icons/fi'

const AppNav = () => {
	return (
		<div className="w-12 h-full bg-gray-900 text-gray-200 flex flex-col justify-between pb-4">
			<div>
				<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
					<GoNote />
				</div>
				<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
					<FiHash />
				</div>
			</div>

			<div className="flex items-center w-full justify-center h-12 hover:text-white hover:bg-black cursor-pointer">
				<FiSettings />
			</div>
		</div>
	)
}

export default AppNav
