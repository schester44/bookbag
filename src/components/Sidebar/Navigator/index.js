import React from 'react'
import { IoMdPricetag } from 'react-icons/io'
import Notebooks from './Notebooks'

import AllNotes from './AllNotesLink'
import Trash from './TrashLink'

const Navigator = () => {
	return (
		<>
			<AllNotes />

			<Notebooks />

			<div className="navigator-link">
				<IoMdPricetag />
				<span className="ml-3">Tags</span>
			</div>

			<Trash />
		</>
	)
}

export default Navigator
