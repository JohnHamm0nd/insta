import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_START,
    AUTH_USER,
    LOGOUT_USER,
    FOLLOW_USER,
    UNFOLLOW_USER,
    GET_FOLLOW_USER,
    GET_USER_PROFILE
} from '../_actions/types'

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return { ...state, signUp: action.payload }
        case LOGIN_USER:
            if (action.payload.statusText === 'OK') {
                return { ...state, userData: action.payload, isAuthenticated: true, isLoaded: true }
            }
        case AUTH_START:
            return { ...state, isLoaded: false }
        case AUTH_USER:
            if (action.payload.statusText === 'OK') {
                return { ...state, userData: action.payload, isAuthenticated: true, isLoaded: true }
            } else {
                return {...state, userData: action.payload, isAuthenticated: false, isLoaded: true }
            }
        case LOGOUT_USER:
            return { ...state, isAuthenticated: false, jwtToken:null, username: null }
        case FOLLOW_USER:
            let newData = state.followUser.data.concat(action.payload.data)
            action.payload.data = newData
            return { ...state, followUser: action.payload }
        case UNFOLLOW_USER:
            let unFollowResults = state.followUser.data.filter(user => user.username !== action.profileUserName)
            action.payload.data = unFollowResults
            return { ...state, followUser: action.payload }
        case GET_FOLLOW_USER:
            return { ...state, followUser: action.payload }
        case GET_USER_PROFILE:
            return { ...state, userProfile: action.payload }
        default:
            return state
    }
}
