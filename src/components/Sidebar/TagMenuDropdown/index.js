import React from 'react'

import Tag from './Tag'
import useOutsideClick from '@rooks/use-outside-click'

const tagSelector = (state) => state.tags.idMap

const TagMenuDropdown = ({ selectedTags, ids, onSelect, onClose }) => {
	const ref = React.useRef()
	const [highlight, setHighlight] = React.useState(0)

	// TODO: Reimplement tags
	// const tags = useSelector(tagSelector)
	const tags = {}

	useOutsideClick(ref, onClose)

	const totalTags = ids.length

	React.useEffect(() => {
		const listener = (e) => {
			switch (e.key) {
				case 'Escape':
					onClose()
					break

				case 'ArrowDown':
					setHighlight((prev) => {
						if (prev + 1 >= totalTags) return 0
						return prev + 1
					})
					break
				case 'ArrowUp':
					setHighlight((prev) => {
						if (prev - 1 < 0) return totalTags - 1
						return prev - 1
					})
					break
				case 'Enter':
					const $elem = ref.current.querySelector('.highlighted')
					if (!$elem) return

					// FIXME: Don't reset the highlight back to zero. skip to the prev/next item in the list.
					// The problem with this currnetly is we return null on tags that are already selected so the indexes aren't accurate.
					// Its possible that the zero-index tag doesn't even exist in the list.
					// Could just use classNames instead of state to set the highlighted element

					setHighlight(0)

					onSelect($elem.dataset.tagid)
					break
				default:
					break
			}
		}

		document.addEventListener('keydown', listener)

		return () => {
			document.removeEventListener('keydown', listener)
		}
	}, [totalTags, onClose, onSelect])

	return (
		<div ref={ref} className="absolute" style={{ top: 'calc(100% + 5px)', left: 0 }}>
			<div className="bg-white shadow rounded w-full">
				<ul>
					{ids.map((id, index) => {
						const tag = tags[id]

						if (selectedTags[tag.id]) return null

						return (
							<Tag
								key={id}
								tag={tag}
								index={index}
								isHighlighted={highlight === index}
								onSelect={() => onSelect(id)}
							/>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

export default TagMenuDropdown
