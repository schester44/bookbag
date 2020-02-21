import React from 'react'
import Notebooks from './Notebooks'

import AllNotes from './AllNotesLink'
import Trash from './TrashLink'

const Navigator = () => {
	return (
		<>
			<AllNotes />
			<Notebooks />
			<Trash />
		</>
	)
}

export default Navigator
