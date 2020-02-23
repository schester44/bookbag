import React from 'react'

const NoteTitle = ({ title, onChange, isReadOnly }) => {
	const ref = React.useRef()

	React.useEffect(() => {
		if (!ref.current) return

		ref.current.focus()
	}, [])

	return (
		<input
			ref={ref}
			className={`border-0 leading-none w-full text-gray-800 placeholder-gray-300 outline-none text-3xl font-semibold bg-transparent my-4 ${isReadOnly ? 'cursor-default' : ''} ${title.length === 0 ? 'italic' : ''} `}
			placeholder="Untitled Note"
			value={title}
			readOnly={isReadOnly}
			onChange={({ target: { value } }) => onChange(value)}
		/>
	)
}

export default NoteTitle
