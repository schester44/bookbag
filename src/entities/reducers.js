import { combineReducers } from '@reduxjs/toolkit'

import editor from './editor/reducer'
import notes from './notes/reducer'
import notebooks from './notebooks/reducer'
import tags from './tags/reducer'
import trash from './trash/reducer'

export default combineReducers({ editor, notes, notebooks, tags, trash })
