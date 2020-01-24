import React from 'react'
import { MdClose } from 'react-icons/md'
import { FiPlus, FiHash } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const tagMapSelector = state => state.tags.idMap

const TagList = ({ ids, onTagCreate, onRemoveTag }) => {
	const [visible, setVisible] = React.useState(false)

	const tags = useSelector(tagMapSelector)
	const inputRef = React.useRef()

	const handleKeyPress = event => {
		if (event.key !== 'Enter' || event.target.value.trim().length === 0) return

		onTagCreate(event.target.value)

		event.target.value = ''
	}

	const handleToggle = () => {
		inputRef.current.focus()

		setVisible(prev => !prev)
	}

	return (
		<div className="flex items-center" style={{ minHeight: 25 }}>
			<FiHash className="cursor-pointer text-gray-400 hover:text-gray-900" onClick={handleToggle} />

			<div className="tags ml-2 flex">
				{ids.map(id => {
					const tag = tags[id]

					return (
						<div
							className="flex items-center mx-1 rounded-full bg-gray-100 border-gray-200 border text-gray-700 px-2 text-sm font-medium"
							key={id}
						>
							<span>{tag.name}</span>
							<MdClose
								className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
								onClick={() => onRemoveTag(tag)}
							/>
						</div>
					)
				})}
			</div>

			<div className={`relative ${visible ? 'visible' : 'hidden'}`}>
				<FiPlus className="absolute text-gray-400" style={{ top: 5, left: 6 }} />
				<input
					ref={inputRef}
					onKeyPress={handleKeyPress}
					type="text"
					placeholder="New tag"
					className="outline-none mx-1 rounded-full border-gray-200 border bg-gray-100 text-gray-700 pl-5 pr-2 text-sm font-medium"
				/>
			</div>
		</div>
	)
}

export default TagList
