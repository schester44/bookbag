import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoNote } from 'react-icons/go'
import { FiHash, FiSettings, FiTrash2 } from 'react-icons/fi'

const AppNav = () => {
	return (
		<div className="w-12 h-full bg-gray-900 text-gray-200 flex flex-col justify-between pb-4">
			<div>
				<NavLink exact to="/" className="app-nav-item">
					<div className="icon">
						<GoNote />
					</div>
				</NavLink>

				<NavLink to="/tags" className="app-nav-item">
					<div className="icon">
						<FiHash />
					</div>
				</NavLink>
			</div>

			<div>
				<NavLink to="/trash" className="app-nav-item">
					<div className="icon">
						<FiTrash2 />
					</div>
				</NavLink>

				<NavLink to="/settings" className="app-nav-item">
					<div className="icon">
						<FiSettings />
					</div>
				</NavLink>
			</div>
		</div>
	)
}

export default AppNav
