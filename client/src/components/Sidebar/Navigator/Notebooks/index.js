import React from 'react'

import Book from './Book'
import AddNewNoteBook from './AddNewNoteBook'

const Notebooks = ({ notebooks }) => {
	return (
		<div className="navigator-list">
			<div className="text-gray-600 text-xs font-bold px-4 pt-4 pb-2">NOTEBOOKS</div>
			{notebooks.map((book) => {
				return <Book key={book.id} book={book} />
			})}

			<AddNewNoteBook />
		</div>
	)
}

export default Notebooks
