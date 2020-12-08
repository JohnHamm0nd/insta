import { axiosInstance } from "../api"
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    FOLLOW_USER,
    UNFOLLOW_USER,
    GET_FOLLOW_USER,
    GET_USER_PROFILE,
} from './types'

export function registerUser(dataToSubmit){
    const request = axiosInstance.post('/account/signup/', dataToSubmit)
        .then(response => response)
        //장고서버에서 에러 발생시(username 이 이미 존재하는 등) error 라는 변수로 넘어온다
        .catch(error => error.response)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axiosInstance.post('/account/token/',dataToSubmit)
                .then(response => response)
                .catch(error => error.response)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axiosInstance.post('/account/token/verify/', {token:window.localStorage.getItem('jwtToken')})
    .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axiosInstance.get('/account/logout/')
    .then(response => response.data)

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function followUser(url, headers, profileUserName){
    const request = axiosInstance.post(url, {profileUserName}, {headers})
        .then(response => response)
    return {
        type: FOLLOW_USER,
        payload: request,
    }
}

export function unFollowUser(url, headers, profileUserName){
    const request = axiosInstance.post(url, {profileUserName}, {headers})
        .then(response => response)
    return {
        type: UNFOLLOW_USER,
        payload: request,
        profileUserName
    }
}

export function getFollowUser(apiUrl, headers){
    const request = axiosInstance.get(apiUrl, {headers})
        .then(response => response)
    return {
        type: GET_FOLLOW_USER,
        payload: request
    }
}

export function getUserProfile(apiUrl, headers, params){
    const request = axiosInstance.get(apiUrl, {headers, params})
        .then(response => response)
    return {
        type: GET_USER_PROFILE,
        payload: request
    }
}

//export function addToCart(productId) {
    ////jwtToken 가져오기
    ////로컬스토리지에서 가져오거나 리덕스에서 가져오기
    ////로컬스토리지에서 가져오는 방법 사용
    //let jwtToken = window.localStorage.getItem('jwtToken')
    //const headers = {Authorization: `JWT ${jwtToken}`}
    //const request = axiosInstance.post('/cart', productId, {headers})
    //.then(response => response.data);

    //return {
        //type: ADD_TO_CART,
        //payload: request
    //}
//}
