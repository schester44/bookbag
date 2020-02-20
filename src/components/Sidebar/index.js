import React from 'react'

import Navigator from './Navigator'
import NotesList from './NotesList'

const Sidebar = () => {
	return (
		<div className="flex sm:w-3/6 xl:w-2/6">
			<Navigator />

			<div className="w-3/5 bg-gray-100 h-full overflow-auto flex flex-col py-1">
				<NotesList />
			</div>
		</div>
	)
}

export default Sidebar
