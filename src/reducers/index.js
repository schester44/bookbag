import { createReducer } from '@reduxjs/toolkit'

import { tagsFetched } from '../actions/tags'

export const notes = createReducer(
	{
		ids: [],
		idMap: {}
	},
	{}
)

export const tags = createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[tagsFetched]: (state, { payload }) => {
			state.ids = payload.tags.ids
			state.idMap = payload.tags.idMap
		}
	}
)
