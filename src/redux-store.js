import { configureStore } from '@reduxjs/toolkit'

import { notes, tags } from './reducers'

export const store = configureStore({
	reducer: {
		notes,
		tags
	}
})
