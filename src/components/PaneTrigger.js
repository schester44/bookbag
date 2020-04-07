import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// import { paneShown, paneHidden } from '../entities/bookbag/actions'

const PaneTrigger = ({ action }) => {
	const isCollapsing = action === 'collapse'

	const handleClick = () => {
		if (isCollapsing) {
			// dispatch(paneHidden())
		} else {
			// dispatch(paneShown())
		}
	}

	return (
		<div
			onClick={handleClick}
			className={`px-2 py-2 rounded text-xl text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${
				isCollapsing ? 'rounded-r-none' : 'rounded-l-none'
			}`}
		>
			{isCollapsing ? <FiChevronLeft /> : <FiChevronRight />}
		</div>
	)
}

export default PaneTrigger
