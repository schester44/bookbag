import { createReducer } from '@reduxjs/toolkit'

import { bookBagInitialized } from './actions'

const initialState = {
	isLoaded: false
}

const actionsMap = {
	[bookBagInitialized]: state => {
		state.isLoaded = true
	}
}

export default createReducer(initialState, actionsMap)
