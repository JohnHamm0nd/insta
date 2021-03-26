import { NAV_KEY, 
	OPEN_ADD_CHAT_POPUP,
	CLOSE_ADD_CHAT_POPUP
} from './types'


export const navKey = (key) => {
  return {
	type: NAV_KEY,
	key
  }
}

export const openAddChatPopup = () => {
  return {
    type: OPEN_ADD_CHAT_POPUP
  };
};

export const closeAddChatPopup = () => {
  return {
    type: CLOSE_ADD_CHAT_POPUP
  };
};

