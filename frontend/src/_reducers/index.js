import { combineReducers } from 'redux'
import user from './user_reducer'
import post from './post_reducer'
import chat from './chat_reducer'
import nav from './nav_reducer'

const rootReducer = combineReducers({
    user,
    post,
    chat,
    nav,
})

export default rootReducer
