import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import produce from 'immer'
import TagMenuDropdown from '../TagMenuDropdown'
import Tag from '../SearchBar/Tag'

const tagsSelector = state => state.tags

/**
 *
 * TODO:
 * - onOutsideClick for dropdown
 * - highlight dropdown matches
 * - dropdown keyboard navigation
 */

const SearchBar = ({ value, onTagSelect, onSearch }) => {
	const inputRef = React.useRef()

	const tags = useSelector(tagsSelector)

	const [state, setState] = React.useState({
		tagsVisible: false,
		tags: tags.ids,
		selectedTags: [],
		selectedTagIds: {},
		searchTerm: ''
	})

	const handleInput = ({ target: { value } }) => {
		setState(prev => {
			const filteredTags = tags.ids.filter(id => {
				const tag = tags.idMap[id]
				return tag.name.toLowerCase().indexOf(value.toLowerCase()) > -1
			})

			return {
				...prev,
				searchTerm: value,
				tags: filteredTags
			}
		})
	}

	const handleFocus = () => {
		setState(prev => ({ ...prev, tagsVisible: true }))
	}

	const handleClear = () => {
		setState(prev => ({
			...prev,
			searchTerm: '',
			selectedTagIds: {},
			selectedTags: []
		}))

		onSearch('')
	}

	const selectTag = React.useCallback(id => {
		setState(prev => ({
			...prev,
			searchTerm: '',
			selectedTags: prev.selectedTags.concat(id),
			selectedTagIds: {
				...prev.selectedTagIds,
				[id]: true
			}
		}))

		inputRef.current.focus()
	}, [])

	const removeTag = id => {
		setState(prev =>
			produce(prev, draft => {
				const index = prev.selectedTags.findIndex(tagId => tagId === id)

				if (index > -1) {
					draft.selectedTags.splice(prev.selectedTags.length - 1, 1)
					delete draft.selectedTagIds[id]
				}
			})
		)
	}

	const handleBackSpace = () => {
		// Do nothing if they're deleting a search term
		if (state.searchTerm.length > 0) return
		// Do nothing if there are no tags to removed
		if (state.selectedTags.length === 0) return

		removeTag(state.selectedTags[state.selectedTags.length - 1])
	}

	const handleKeyPress = e => {
		switch (e.key) {
			case 'Backspace':
				handleBackSpace()
				break
			case 'Enter':
				// FIXME: don't call `onSearch` when selecting items from the dropdown
				onSearch(state.searchTerm)
				break
			default:
				break
		}
	}

	const onTagMenuDropdownClose = React.useCallback(() => {
		setState(prev => ({ ...prev, tagsVisible: false }))
	}, [])

	return (
		<div className="relative flex items-center w-full px-2 outline-none text-gray-600 bg-gray-300 rounded">
			{value.length === 0 && state.selectedTags.length === 0 ? (
				<FiSearch style={{ minWidth: 20 }} className="text-gray-500" />
			) : (
				<div
					onClick={handleClear}
					className="cursor-pointer flex items-center justify-center rounded-full bg-gray-500"
					style={{ minWidth: 14, width: 14, height: 14 }}
				>
					<FiX className="text-white text-xs" />
				</div>
			)}

			{state.searchTerm.length === 0 && state.selectedTags.length === 0 && (
				<span className="pl-6 text-gray-600 pointer-events-none absolute">Search</span>
			)}

			{state.selectedTags.length > 0 && (
				<div className="flex flex-1 pl-1">
					{state.selectedTags.map(id => {
						const tag = tags.idMap[id]

						return <Tag tag={tag} key={id} onRemove={() => removeTag(id)} />
					})}
				</div>
			)}

			<input
				ref={inputRef}
				onMouseUp={handleFocus}
				value={state.searchTerm}
				onKeyDown={handleKeyPress}
				onChange={handleInput}
				style={{ minWidth: 5 }}
				className="px-1 py-1 outline-none text-gray-600 bg-transparent flex-1"
				type="text"
			/>

			{state.tagsVisible && (
				<TagMenuDropdown
					selectedTags={state.selectedTagIds}
					ids={state.tags}
					onSelect={selectTag}
					onClose={onTagMenuDropdownClose}
				/>
			)}
		</div>
	)
}

export default SearchBar
