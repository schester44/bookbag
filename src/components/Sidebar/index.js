import React from 'react'

import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import Navigator from './Navigator'
import NotesList from './NotesList'

const Sidebar = () => {
	return (
		<DndProvider backend={Backend}>
			<div className="flex sm:w-3/6 xl:w-5/12">
				<div className="w-5/12 bg-gray-900 border-r border-gray-300 pt-8">
					<Navigator />
				</div>

				<div className="w-7/12 bg-gray-100 h-full overflow-auto flex flex-col py-1">
					<NotesList />
				</div>
			</div>
		</DndProvider>
	)
}

export default Sidebar
