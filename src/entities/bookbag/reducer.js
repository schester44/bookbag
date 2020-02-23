import { createReducer } from '@reduxjs/toolkit'

import { bookBagInitialized, paneShown, paneHidden } from './actions'

const initialState = {
	collapsed: 0,
	isLoaded: false
}

const actionsMap = {
	[paneShown]: state => {
		state.collapsed--
	},
	[paneHidden]: state => {
		state.collapsed++
	},
	[bookBagInitialized]: state => {
		state.isLoaded = true
	}
}

export default createReducer(initialState, actionsMap)
