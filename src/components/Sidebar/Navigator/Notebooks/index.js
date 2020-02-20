import React from 'react'
import { useSelector } from 'react-redux'

import Heading from './Heading'
import Book from './Book'
const booksSelector = state => state.notebooks

const Notebooks = () => {
	const notebooks = useSelector(booksSelector)

	return (
		<div>
			<Heading />

			<div className="navigator-list">
				{notebooks.ids.map(id => {
					const book = notebooks.idMap[id]

					return <Book key={id} book={book} />
				})}
			</div>
		</div>
	)
}

export default Notebooks
