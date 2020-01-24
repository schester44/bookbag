import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { reducer } from './reducers'

export const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware({
		serializableCheck: false
	})
})
