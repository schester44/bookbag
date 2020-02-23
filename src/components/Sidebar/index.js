import React from 'react'

import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import Navigator from './Navigator'
import NotesList from './NotesList'
import PaneTrigger from '../../components/PaneTrigger'

import { useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TrashList = React.lazy(() => import('./TrashList'))

const collapsedSelector = state => state.bookbag.collapsed
const Sidebar = () => {
	const match = useRouteMatch()
	const collapsed = useSelector(collapsedSelector)
	const navRef = React.useRef()
	const listRef = React.useRef()

	const listBox = listRef.current?.getBoundingClientRect()
	const navBox = navRef.current?.getBoundingClientRect()

	return (
		<DndProvider backend={Backend}>
			<div
				className="flex sm:w-3/6 xl:w-4/12"
				style={{
					transition: 'margin .2s ease-in-out',
					marginLeft:
						collapsed === 1
							? -(navBox.width || 0)
							: collapsed === 2
							? -((navBox.width || 0) + (listBox.width || 0))
							: 0
				}}
			>
				<div ref={navRef} className="w-5/12 bg-gray-900 border-r border-gray-300 pt-8">
					<Navigator />
				</div>

				<div
					className="relative w-7/12 bg-gray-100 h-full overflow-auto flex flex-col py-1"
					ref={listRef}
					style={{
						minWidth: 275
					}}
				>
					<React.Suspense fallback={null}>
						{match.path === '/trash' || match.path === '/trash/:noteId' ? (
							<TrashList />
						) : (
							<NotesList />
						)}
					</React.Suspense>

					<div className="absolute bottom-0 right-0 mb-2">
						<PaneTrigger action="collapse" />
					</div>
				</div>
			</div>
		</DndProvider>
	)
}

export default Sidebar
