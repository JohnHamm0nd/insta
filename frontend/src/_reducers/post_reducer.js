import {
    GET_POST,
    LOADMORE_POST,
    DELETE_POST,
    LIKE_POST,
} from '../_actions/types'


export default function(state={},action){
    switch (action.type) {
        case GET_POST:
            return {...state, postList: action.payload.data}
        case LOADMORE_POST:
            let newPostList = state.postList.results.concat(action.payload.data.results)
            action.payload.data.results = newPostList
            return {...state, postList: action.payload.data}
        case DELETE_POST:
            let deletePostResults = state.postList.results.filter(post => post.id !== action.postId)
            let resultsPostList = {...state.postList, results: deletePostResults}
            return {...state, postList: resultsPostList}
        case LIKE_POST:
            let likePost = state.postList.results.map(post => post.id === action.postId ? {...post, is_like:action.isLike}: post)
            let resultsLikePost = {...state.postList, results: likePost}
            return {...state, postList: resultsLikePost}
        default:
            return state
    }
}
