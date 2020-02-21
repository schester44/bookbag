import { combineReducers } from '@reduxjs/toolkit'

import bookbag from './bookbag/reducer'
import notes from './notes/reducer'
import notebooks from './notebooks/reducer'
import tags from './tags/reducer'
import trash from './trash/reducer'

export default combineReducers({ bookbag, notes, notebooks, tags, trash })
