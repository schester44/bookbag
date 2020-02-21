import React from 'react'
import { FaBook } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { useDispatch } from 'react-redux'

import { createNotebook } from '../../../../entities/notebooks/actions'
import { useHistory } from 'react-router-dom'

const Heading = () => {
	const dispatch = useDispatch()
	const history = useHistory()

	const [state, setState] = React.useState({
		newBookInputVisible: false,
		newBookName: ''
	})

	const handleNewBookInputKeyDown = e => {
		if (e.key === 'Escape') {
			return setState(prev => ({ ...prev, newBookInputVisible: false, newBookName: '' }))
		}

		// save
		if (e.key !== 'Enter' || state.newBookName.trim().length === 0) return

		const name = state.newBookName

		dispatch(createNotebook({ name })).then(notebook => {
			history.push(`/notebook/${notebook.id}`)
		})

		setState(prev => ({ ...prev, newBookInputVisible: false, newBookName: '' }))
	}

	const handleNewBookInputChange = ({ target: { value } }) => {
		setState(prev => ({ ...prev, newBookName: value }))
	}

	return (
		<div>
			<div className="navigator-navitem flex items-center justify-between">
				<div className="flex items-center">
					<FaBook />
					<span className="ml-3">Notebooks</span>
				</div>

				<GoPlus
					className="cursor-pointer hover:text-indigo-500"
					onClick={() => setState(prev => ({ ...prev, newBookInputVisible: true }))}
				/>
			</div>

			{state.newBookInputVisible && (
				<div className="pl-12 bg-gray-800 py-2 pr-2 mb-2">
					<input
						autoFocus
						className="bg-transparent text-white outline-none"
						type="text"
						value={state.newBookName}
						onKeyDown={handleNewBookInputKeyDown}
						onChange={handleNewBookInputChange}
					/>
				</div>
			)}
		</div>
	)
}

export default Heading
