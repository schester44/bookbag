import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoIosPaper, IoMdPricetag } from 'react-icons/io'
import Notebooks from './Notebooks'

const Navigator = () => {
	return (
		<>
			<NavLink exact to="/" className="navigator-link">
				<IoIosPaper />
				<span className="ml-3">All Notes</span>
			</NavLink>

			<Notebooks />

			<div className="navigator-link">
				<IoMdPricetag />
				<span className="ml-3">Tags</span>
			</div>
		</>
	)
}

export default Navigator
