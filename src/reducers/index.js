import { createReducer } from '@reduxjs/toolkit'
import union from 'lodash/union'

import {
	tagsFetched,
	tagCreated,
	noteTagsFetched,
	noteTagged,
	noteTagRemoved
} from '../actions/tags'

import { notesFetched, noteSaved, noteCreated, notesInitialized } from '../actions/notes'

import { noteTrashed, noteRestored, trashFetched, noteDeleted } from '../actions/trash'

import { activeNoteChanged } from '../actions/editor'

const editor = createReducer(
	{ activeNoteId: undefined },
	{
		[activeNoteChanged]: (state, { payload }) => {
			state.activeNoteId = payload.note.id
		},
		[notesInitialized]: (state, { payload }) => {
			state.activeNoteId = payload.activeNote.id
		},
		[noteCreated]: (state, { payload }) => {
			state.activeNoteId = payload.note.id
		},
		[noteTrashed]: (state, { payload }) => {
			if (payload.activeNoteId && payload.activeNoteId !== state.activeNoteId) {
				state.activeNoteId = payload.activeNoteId
			}
		}
	}
)

const notes = createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[notesInitialized]: (state, { payload }) => {
			if (payload.isNewNote) {
				state.ids.unshift(payload.activeNote.id)
				state.idMap[payload.activeNote.id] = payload.activeNote
			}
		},
		[noteSaved]: (state, { payload }) => {
			state.idMap[payload.note.id] = payload.note
		},
		[noteTrashed]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.note.id)
			delete state.idMap[payload.note.id]
		},
		[noteRestored]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		},
		[notesFetched]: (state, { payload }) => {
			state.ids = payload.notes.ids.sort((a, b) => {
				return payload.notes.idMap[b].lastUpdate - payload.notes.idMap[a].lastUpdate
			})

			state.idMap = payload.notes.idMap
		},
		[noteCreated]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		}
	}
)

const tags = createReducer(
	{
		byNote: {},
		ids: [],
		idMap: {}
	},
	{
		[noteTagRemoved]: (state, { payload }) => {
			state.byNote[payload.noteId] = state.byNote[payload.noteId].filter(id => id !== payload.tagId)
		},
		[tagCreated]: (state, { payload }) => {
			state.ids.push(payload.tag.id)
			state.idMap[payload.tag.id] = payload.tag
		},

		[noteTagged]: (state, { payload }) => {
			state.byNote[payload.noteId] = union(state.byNote[payload.noteId], [payload.tagId])
		},
		[noteTagsFetched]: (state, { payload }) => {
			state.byNote[payload.noteId] = payload.tags
		},
		[tagsFetched]: (state, { payload }) => {
			state.ids = payload.tags.ids
			state.idMap = payload.tags.idMap
		},
		[noteRestored]: (state, { payload }) => {
			if (payload.note.relations?.tags) {
				state.byNote[payload.note.id] = payload.note.relations.tags

				payload.note.relations.tags.forEach(tagId => {
					state.idMap[tagId] = state.idMap[tagId].concat(payload.note.id)
				})
			}
		},
		[noteTrashed]: (state, { payload }) => {
			if (state.byNote[payload.note.id]?.length > 0) {
				delete state.byNote[payload.note.id]
			}
		}
	}
)

const trash = createReducer(
	{
		ids: [],
		idMap: {}
	},
	{
		[trashFetched]: (state, { payload }) => {
			state.ids = payload.trash.ids
			state.idMap = payload.trash.idMap
		},
		[noteRestored]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.note.id)
			delete state.idMap[payload.note.id]
		},
		[noteTrashed]: (state, { payload }) => {
			state.ids.unshift(payload.note.id)
			state.idMap[payload.note.id] = payload.note
		},
		[noteDeleted]: (state, { payload }) => {
			state.ids = state.ids.filter(id => id !== payload.noteId)
			delete state.idMap[payload.noteId]
		}
	}
)

const defaultTagsArray = []

export const activeNoteTagsSelector = noteId => state =>
	state.tags.byNote[noteId] || defaultTagsArray

export const reducer = { editor, tags, notes, trash }
