import React from 'react'
import cn from 'classnames'
import NotesList from '../Sidebar/NotesList'
import { useParams, useHistory } from 'react-router-dom'
import { FiChevronLeft } from 'react-icons/fi'
import Button from 'components/Button'

const MovbileNav = () => {
	const { noteId } = useParams()
	const history = useHistory()

	if (noteId) {
		return (
			<div className="w-full border-b px-1 py-1">
				<div
					onClick={() => history.goBack()}
					className="flex items-center w-8 rounded bg-gray-300 py-2 px-2 text-gray-600 font-bold cursor-pointer hover:text-gray-700"
				>
					<FiChevronLeft />
				</div>
			</div>
		)
	}

	return (
		<div
			className={cn('w-full', {
				'h-full': !noteId,
			})}
		>
			<NotesList />
		</div>
	)
}

export default MovbileNav
