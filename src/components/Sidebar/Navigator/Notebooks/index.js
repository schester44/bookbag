import React from 'react'

import Heading from './Heading'
import Book from './Book'

const Notebooks = ({ notebooks }) => {
	return (
		<div>
			<Heading />

			<div className="navigator-list">
				{notebooks.map((book) => {
					return <Book key={book.id} book={book} />
				})}
			</div>
		</div>
	)
}

export default Notebooks
