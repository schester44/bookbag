import React from 'react'

const Tag = ({ tag, index, isHighlighted, onSelect }) => {
	return (
		<li
			onClick={() => onSelect(tag.id)}
			key={`tf-${tag.id}`}
			data-tagid={tag.id}
			data-index={index}
			className={`px-4 py-1 cursor-pointer hover:bg-gray-100 ${
				isHighlighted ? 'highlighted bg-indigo-100' : ''
			}`}
		>
			{tag.name}
		</li>
	)
}

export default Tag
