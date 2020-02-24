import React from 'react'
import { useEditor, useReadOnly, ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import { FiCheck } from 'react-icons/fi'

export const CheckListItemElement = ({ attributes, children, element }) => {
	const editor = useEditor()
	const readOnly = useReadOnly()
	const { checked } = element

	return (
		<div className={`flex mb-2 items-center`} {...attributes}>
			<span className="mr-2" style={{ userSelect: 'none' }} contentEditable={false}>
				<div
					className="rounded border text-gray-700 bg-gray-200 w-6 h-6 flex items-center justify-center cursor-pointer"
					onClick={() => {
						const path = ReactEditor.findPath(editor, element)
						Transforms.setNodes(editor, { checked: !checked }, { at: path })
					}}
				>
					{checked && <FiCheck />}
				</div>
			</span>
			<span
				className={checked ? 'text-gray-400 line-through' : ''}
				contentEditable={!readOnly}
				suppressContentEditableWarning
			>
				{children}
			</span>
		</div>
	)
}
