import React from 'react'

import Backend from 'react-dnd-html5-backend'
import cn from 'classnames'
import { DndProvider } from 'react-dnd'

import Navigator from './Navigator'
import NotesList from './NotesList'
import PaneTrigger from '../../components/PaneTrigger'

import { useRouteMatch, useParams } from 'react-router-dom'
import { useSidebar } from 'hooks/useSidebar'
import { useWindowSize } from 'hooks/useWindowSize'

const TrashList = React.lazy(() => import('./TrashList'))

const Sidebar = ({ user }) => {
	const match = useRouteMatch()
	const { noteId } = useParams()
	const { depth } = useSidebar()
	const { width } = useWindowSize()

	const navRef = React.useRef()
	const listRef = React.useRef()

	const listBox = listRef.current?.getBoundingClientRect()
	const navBox = navRef.current?.getBoundingClientRect()

	if (width < 1024) {
		return <div>HELLO</div>
	}

	return (
		<DndProvider backend={Backend}>
			<div
				className={cn('flex h-full', {
					'w-full': !noteId,
					'sm:w-full lg:w-3/6 xl:w-2/6 max-h-half lg:max-h-full': noteId,
				})}
				style={{
					minWidth: 200,
					transition: 'margin .2s ease-in-out',
					marginLeft:
						depth === 1
							? -(navBox?.width || 0)
							: depth === 0
							? -((navBox?.width || 0) + (listBox?.width || 0))
							: 0,
				}}
			>
				<div ref={navRef} className={`w-64 bg-gray-900 border-r border-gray-300 pt-8`}>
					<Navigator user={user} />
				</div>

				<div
					className={`bg-gray-100 flex-1 py-1 relative pb-12`}
					ref={listRef}
					style={{
						minWidth: 275,
					}}
				>
					<React.Suspense fallback={null}>
						{match.path === '/trash' || match.path === '/trash/:noteId' ? (
							<TrashList />
						) : (
							<NotesList />
						)}
					</React.Suspense>

					{noteId && (
						<div className="absolute bottom-0 left-0 border-t w-full h-12">
							{depth > 0 && depth <= 2 && (
								<div className="absolute bottom-0 left-0 mb-2">
									<PaneTrigger action="collapse" />
								</div>
							)}

							{depth < 2 && (
								<div
									className={`z-20 bottom-0 mb-2 ${
										depth === 0 ? 'fixed left-0' : 'absolute right-0'
									}`}
								>
									<PaneTrigger action="expand" />
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</DndProvider>
	)
}

export default Sidebar
