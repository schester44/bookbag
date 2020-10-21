import { Editor, Point, Range, Transforms } from 'slate'

export const withChecklists = editor => {
	const { deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		const isCollapsed = selection && Range.isCollapsed(selection)

		if (isCollapsed) {
			const [match] = Editor.nodes(editor, {
				match: n => n.type === 'check-list-item'
			})

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					Transforms.setNodes(
						editor,
						{ type: 'paragraph' },
						{ match: n => n.type === 'check-list-item' }
					)
					return
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}
