import React from 'react'
import { FiImage } from 'react-icons/fi'

import { insertImage } from '../plugins/withImages'
import isUrl from 'is-url'

const InsertImageButton = ({ editor }) => {
	const [state, setState] = React.useState({ visible: false, value: '' })

	const handleKeyPress = e => {
		if (e.key === 'Escape') {
			setState({ visible: false, value: '' })
		}

		if (e.key !== 'Enter') return

		if (state.value.trim().length === 0) {
			setState({ visible: false, value: '' })
		}

    // TODO: Show error
		if (!isUrl(state.value)) return

		insertImage(editor, state.value)
		setState({ visible: false, value: '' })
	}

	return (
		<div className="relative">
			<div
				className={`toolbar-btn`}
				onClick={() =>
					setState(prev => ({
						...prev,
						visible: !prev.visible
					}))
				}
			>
				<span>
					<FiImage />
				</span>
			</div>

			{state.visible && (
				<div
					className="shadow-lg w-64 bg-white rounded absolute left-0 border border-gray-300"
					style={{ top: '100%' }}
				>
					<input
						placeholder="Enter Image URL"
						autoFocus
						value={state.value}
						onChange={({ target: { value } }) => {
							setState(prev => ({ ...prev, value }))
						}}
						onKeyDown={handleKeyPress}
						className="text-gray-700 text-xs font-bold px-2 py-1 rounded w-full outline-none"
					/>
				</div>
			)}
		</div>
	)
}

export default InsertImageButton
