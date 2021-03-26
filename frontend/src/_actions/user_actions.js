import { axiosInstance } from "../api"
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_START,
    AUTH_USER,
    LOGOUT_USER,
    FOLLOW_USER,
    UNFOLLOW_USER,
    GET_FOLLOW_USER,
    GET_USER_PROFILE,
} from './types'


export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

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
    authStart()
    const request = axiosInstance.post('/account/token/',dataToSubmit)
                .then(response => response
                )
                .catch(error => error.response)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function authUser(){
    authStart()
    const request = axiosInstance.post('/account/token/verify/', {token:localStorage.getItem('jwtToken')})
    .then(response => response)

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");

    return {
        type: LOGOUT_USER,
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
