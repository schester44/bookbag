import React from 'react'

const TodoItem = ({ attributes, children }) => {
	// TODO: How to preserve TODO state?
	const [checked, setChecked] = React.useState(false)
	return (
		<div
			className={`w-1/2 bg-gray-100 rounded px-2 py-1 mb-2 flex items-center ${
				checked ? 'text-gray-400 line-through' : ''
			}`}
			{...attributes}
		>
			<span className="mr-2" style={{ userSelect: 'none' }} contentEditable={false}>
				<input
					type="checkbox"
					onChange={({ target: { checked } }) => setChecked(checked)}
					checked={checked}
				/>
			</span>
			{children}
		</div>
	)
}

const Element = ({ onTodoCheck, attributes, children, element }) => {
	switch (element.type) {
		case 'link':
			return (
				<a className="underline text-indigo-400 cursor-pointer" {...attributes} href={element.url} target="new">
					{children}
				</a>
			)
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>
		case 'numbered-list':
			return (
				<ul className="list-decimal list-inside" {...attributes}>
					{children}
				</ul>
			)
		case 'bulleted-list':
			return (
				<ul className="list-disc list-inside" {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 className="text-2xl font-bold" {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 className="text-xl font-bold" {...attributes}>
					{children}
				</h2>
			)
		case 'todo-item':
			return <TodoItem onTodoCheck={onTodoCheck} attributes={attributes} children={children} />
		case 'list-item':
			return <li {...attributes}>{children}</li>
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>
		default:
			return <p {...attributes}>{children}</p>
	}
}

export default Element
