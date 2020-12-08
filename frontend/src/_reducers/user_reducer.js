import {
    LOGIN_USER,
    REGISTER_USER,
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
            return {  ...state, userData: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
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
        //case ADD_TO_CART:
            //return {...state, userData: {
                //...state.userData, cart: action.payload
            //}}
        default:
            return state
    }
}
