import React from 'react'
import { NavLink } from 'react-router-dom'

import Notebooks from './Notebooks'
import AllNotes from './AllNotesLink'
import Trash from './TrashLink'
import { FiSettings } from 'react-icons/fi'

const Navigator = () => {
	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<AllNotes />
				<Notebooks />
				<Trash />
			</div>
			<div>
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
