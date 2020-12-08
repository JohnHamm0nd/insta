import {
    GET_POST,
    LOADMORE_POST,
    DELETE_POST,
    LIKE_POST,
} from '../_actions/types'


export default function(state={},action){
    switch(action.type){
        case GET_POST:
            //let postList = action.payload.data.results
            //console.log(postList)
            //console.log(action.payload.data.results)
            //return {...state, postList: action.payload.data.results}
            console.log(action.payload.data)
            return {...state, postList: action.payload.data}
        case LOADMORE_POST:
            //console.log(state.postList)
            //console.log(state)
            //더보기 버튼 이므로 포스트들은 이전 포스트들에 추가가 되어야 하고 나머지 값들은 업데이트(변경) 되어야 함
            //이전 state 의 postList.resutls 에 현재 state 에 results 를 합침(포스트리스트)
            let newPostList = state.postList.results.concat(action.payload.data.results)
            //현재 state 의 results 에 넣음
            action.payload.data.results = newPostList
            //console.log(action.payload.data.results)
            return {...state, postList: action.payload.data}
        case DELETE_POST:
            //console.log(state.postList)
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
