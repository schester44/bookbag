import React from 'react'
import cn from 'classnames'

const NoteTitle = ({ title, onChange, isReadOnly }) => {
	return (
		<input
			className={cn(
				'border-0 leading-none w-full text-gray-800 placeholder-gray-300 outline-none text-3xl font-semibold bg-transparent mt-8 mb-2',
				{
					'cursor-default': isReadOnly,
					italic: title.length === 0,
				}
			)}
			placeholder="Untitled Note"
			value={title}
			readOnly={isReadOnly}
			onChange={({ target: { value } }) => onChange(value)}
		/>
	)
}

export default NoteTitle
