import { API_HOST } from "../Constants";
import { axiosInstance } from "../api"
import {
    ADD_MESSAGE,
    SET_MESSAGES,
    PREVIOUS_MESSAGES,
    GET_CHATS_SUCCESS,
    CREATE_OR_CHANGE_CHAT,
    CHANGE_CHAT,
} from './types.js'


export const createOrChangeChat = (addUser) => {
  return (dispatch, getState) => {
    const state = getState()
    const User = state.user
    const Chats = state.chat.chats
    let addFlag = true
    
    let jwtToken = window.localStorage.getItem('jwtToken')
    const headers = {Authorization: `JWT ${jwtToken}`}
    

    //~ 비교 후 CHANGE OR CREATE
    if ( Chats ) {
      for (var i = 0; i < Chats.length; i++) {
        if (Chats[i][0].participants.includes(addUser)) {
          addFlag = false
          dispatch(changeChat(Chats[i][0].id))
          break
        }
      }
    }
    
    if ( addFlag ) {
      const chatUsers = [User.userData.data.user.username, addUser]
      axiosInstance.post('chat/create/', { messages: [], participants: chatUsers }, {headers})
        .then(response => {
          dispatch(getUserChats(User.userData.data.user.username, jwtToken))
        })
    }
  }
}

export const changeChat = chatID => {
  return {
    type: CHANGE_CHAT,
    chatID
  }
}

export const addMessage = message => {
  return {
    type: ADD_MESSAGE,
    message: message
  };
};

export const setMessages = (avatar_url, messages) => {
  return {
    type: SET_MESSAGES,
    avatar_url: avatar_url,
    messages: messages
  };
};

export const previousMessages = messages => {
  return {
    type: PREVIOUS_MESSAGES,
    messages: messages
  };
};

const getUserChatsSuccess = chats => {
  return {
    type: GET_CHATS_SUCCESS,
    chats: chats
  };
};

export const getUserChats = (username, token) => {
  return dispatch => {
    axiosInstance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axiosInstance.defaults.xsrfCookieName = "csrftoken";
    axiosInstance.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axiosInstance
      .get(`${API_HOST}/chat/?username=${username}`)
      .then(res => dispatch(getUserChatsSuccess(res.data)));
  };
};
