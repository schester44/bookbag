import React from 'react'
import { MdClose } from 'react-icons/md'

const TagList = ({ tagIds, tagsById, onTagCreate, onRemoveTagFromNote }) => {
	const handleKeyPress = event => {
		if (event.key !== 'Enter' || event.target.value.trim().length === 0) return

		onTagCreate(event.target.value)

		event.target.value = ''
	}

	return (
		<div className="flex items-center">
			<div className="tags mr-2 flex">
				{tagIds.map(id => {
					const tag = tagsById[id]

					return (
						<div
							className="flex items-center mx-1 rounded bg-gray-100 border-gray-200 border text-gray-700 px-2 text-sm font-medium"
							key={id}
						>
							<span>{tag.name}</span>
							<MdClose
								className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
								onClick={() => onRemoveTagFromNote(tag)}
							/>
						</div>
					)
				})}
			</div>

			<input
				onKeyPress={handleKeyPress}
				type="text"
				placeholder="New tag"
				className="outline-none mx-1 rounded border-gray-200 border text-gray-700 px-2 text-sm"
			/>
		</div>
	)
}

export default TagList
