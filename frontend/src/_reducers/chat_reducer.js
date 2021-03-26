import { updateObject } from "../utils/updateObject";
import {
    ADD_MESSAGE,
    SET_MESSAGES,
    PREVIOUS_MESSAGES,
    GET_CHATS_SUCCESS,
    CREATE_CHAT,
    CHANGE_CHAT,
} from '../_actions/types'

const initialState = {
  messages: [],
  chats: [],
  chatID: null,
  previousLoad: false
};

const addMessage = (state, action) => {
  return updateObject(state, {
    messages: [...state.messages, action.message],
    previousLoad: false
  });
};

const setMessages = (state, action) => {
  return updateObject(state, {
    avatar_url: action.avatar_url,
    messages: action.messages.reverse(),
    previousLoad: false
  });
};

const previousMessages = (state, action) => {
  let newMessages = action.messages.reverse().concat(state.messages)
  return {...state, messages: newMessages, previousLoad: true}
};

const setChats = (state, action) => {
  let chats = action.chats.results
  let sortObj = []
  
  //~ 정렬(마지막 메시지 기준)
  //~ TODO: 최근 메시지를 주고 받았던 채팅방 일수록 위로 오게
  for (let chat in chats) {
    sortObj.push([chats[chat], chats[chat].messages[chats[chat].messages.length-1]])
  }
  sortObj.sort(function(a, b) {
    return b[1] - a[1];
  });
  if ( sortObj.length > 0 ) {
    return updateObject(state, {
      chats: sortObj,
      chatID: sortObj[0][0].id
    })
  } else {
    return false
  }
};

const changeChat = (state, action) => {
  return updateObject(state, {
    chatID: action.chatID
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return addMessage(state, action);
    case SET_MESSAGES:
      return setMessages(state, action);
    case PREVIOUS_MESSAGES:
      return previousMessages(state, action);
    case GET_CHATS_SUCCESS:
      return setChats(state, action);
    case CHANGE_CHAT:
      return changeChat(state, action)
    default:
      return state;
  }
};

export default reducer;
