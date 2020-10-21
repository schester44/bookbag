import React from 'react'

import { CheckListItemElement } from './elements/CheckListItemElement'
import { Image } from './elements/Image'

const Element = ({ attributes, children, element, ...props }) => {
	switch (element.type) {
		case 'code':
			return (
				<code {...attributes} className="bg-gray-200">
					{children}
				</code>
			)
		case 'link':
			return (
				<a
					className="underline text-indigo-400 cursor-pointer"
					{...attributes}
					href={element.url}
					target="new"
				>
					{children}
				</a>
			)
		case 'block-quote':
			return <blockquote className="bg-gray-100 border-l-2 border-indigo-200 text-gray-700 px-2 py-2" {...attributes}>{children}</blockquote>

		case 'bulleted-list':
			return (
				<ul className="list-disc list-inside" {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 className="text-3xl font-bold" {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 className="text-2xl font-bold" {...attributes}>
					{children}
				</h2>
			)
		case 'heading-three':
			return (
				<h3 className="text-xl font-bold" {...attributes}>
					{children}
				</h3>
			)

		case 'list-item':
			return <li {...attributes}>{children}</li>
		case 'numbered-list':
			return (
				<ol className="list-decimal list-inside" {...attributes}>
					{children}
				</ol>
			)
		case 'checklist-item':
			return (
				<CheckListItemElement
					attributes={attributes}
					children={children}
					element={element}
					{...props}
				/>
			)
		case 'image':
			return <Image attributes={attributes} children={children} element={element} {...props} />
		default:
			return <p {...attributes}>{children}</p>
	}
}

export default Element
