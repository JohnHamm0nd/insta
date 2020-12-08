import { axiosInstance } from "../api"
import {
    GET_POST,
    LOADMORE_POST,
    DELETE_POST,
    LIKE_POST,
} from './types.js'


export function getPost(DataUrl, headers, params) {
    
    //let jwtToken = window.localStorage.getItem('jwtToken')
    //let headers = {Authorization: `JWT ${jwtToken}`}
    
    const request = axiosInstance.get(DataUrl, {headers, params})
        .then(response => response)
        .catch()
        
    return {
        type: GET_POST,
        payload: request
    }
}

export function loadMorePost(DataUrl, headers, params) {
    
    const request = axiosInstance.get(DataUrl, {headers, params})
        .then(response => response)
        .catch()
        
    return {
        type: LOADMORE_POST,
        payload: request
    }
}

export function deletePost(DataUrl, headers, postId) {
    
    const request = axiosInstance.delete(DataUrl, {headers})
        .then(response => response)
        .catch()
        
    return {
        type: DELETE_POST,
        payload: request,
        postId,
    }
}

export function likePost(url, method, headers, postId, isLike) {
    const request = axiosInstance({
        url,
        method,
        headers,
    })
        .then(response => response)
    return {
        type: LIKE_POST,
        payload: request,
        postId,
        isLike,
    }
}

