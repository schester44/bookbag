import React from 'react'
import { FaHashtag } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

const TagList = ({ tagIds, tagsById, onTagCreate, onRemoveTagFromNote }) => {
	const handleKeyPress = event => {
		if (event.key !== 'Enter' || event.target.value.trim().length === 0) return

		onTagCreate(event.target.value)

		event.target.value = ''
	}

	return (
		<div className="p-2 flex items-center">
			<FaHashtag />
			<input
				onKeyPress={handleKeyPress}
				type="text"
				placeholder="New tag"
				className="ml-1 text-xs bg-gray-200 outline-none border-gray-200 border rounded-full px-2"
			/>

			<div className="tags mr-2 flex">
				{tagIds.map(id => {
					const tag = tagsById[id]

					return (
						<div
							className="flex items-center mx-1 rounded-full bg-gray-200 px-2 text-xs font-medium"
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
		</div>
	)
}

export default TagList
