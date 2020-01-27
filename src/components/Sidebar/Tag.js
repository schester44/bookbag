import React from 'react'
import { FiHash } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const tagSelector = id => state => {
	return state.tags.idMap[id]
}

const Tag = ({ id }) => {
	const tag = useSelector(tagSelector(id))

	if (!tag) return null

	return (
		<div className={'flex px-8 py-3'}>
			<div className="text-gray-400 mr-2">
				<FiHash />
			</div>
			<div className="cursor-pointer">
				<p className="leading-none">
					{tag.name || <span className="text-gray-600 italic">Untitled Tag</span>}
				</p>
			</div>
		</div>
	)
}

export default Tag
