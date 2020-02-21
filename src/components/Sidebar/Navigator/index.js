import React from 'react'
import { IoMdPricetag } from 'react-icons/io'
import Notebooks from './Notebooks'

import AllNotes from './AllNotesLink'

const Navigator = () => {
	return (
		<>
			<AllNotes />

			<Notebooks />

			<div className="navigator-link">
				<IoMdPricetag />
				<span className="ml-3">Tags</span>
			</div>
		</>
	)
}

export default Navigator
