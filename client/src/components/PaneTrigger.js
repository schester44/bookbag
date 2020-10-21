import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useSidebar } from 'hooks/useSidebar'

const PaneTrigger = ({ action }) => {
	const isCollapsing = action === 'collapse'

	const { setDepth } = useSidebar()

	const handleClick = () => {
		if (isCollapsing) {
			setDepth((depth) => depth - 1)
		} else {
			setDepth((depth) => depth + 1)
		}
	}

	return (
		<div
			onClick={handleClick}
			className={`px-2 cursor-pointer py-2 rounded text-xl text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${
				isCollapsing ? 'rounded-r-none' : 'rounded-l-none'
			}`}
		>
			{isCollapsing ? <FiChevronLeft /> : <FiChevronRight />}
		</div>
	)
}

export default PaneTrigger
