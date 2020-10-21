import React from 'react'
import { FiX } from 'react-icons/fi'

const Tag = ({ tag, onRemove }) => {
	return (
		<div
			className="flex items-center mr-1 text-xs bg-gray-900 text-white px-1 rounded whitespace-no-wrap"
			key={`t-${tag.id}`}
		>
			<span>{tag.name}</span>

			<span>
				<FiX
					className="text-xs text-gray-400 leading-none ml-1 cursor-pointer"
					onClick={onRemove}
				/>
			</span>
		</div>
	)
}

export default Tag
