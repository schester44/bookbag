import React from 'react'

const SearchBar = ({ onSearch }) => {
	return (
		<input
			onChange={({ target: { value } }) => onSearch(value)}
			className="w-full px-2 py-1 outline-none text-gray-600 bg-gray-300 rounded-full"
			type="text"
			placeholder="Search..."
		/>
	)
}

export default SearchBar
