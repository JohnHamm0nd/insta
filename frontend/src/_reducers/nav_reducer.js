import { NAV_KEY, 
	OPEN_ADD_CHAT_POPUP,
	CLOSE_ADD_CHAT_POPUP
} from '../_actions/types'
import { updateObject } from "../utils/updateObject";


const initialState = {
  navKey: 1,
  showAddChatPopup: false
};

const navKey = (state, action) => {
  return updateObject(state, {navKey: action.key})
}

const openAddChatPopup = (state, action) => {
  return updateObject(state, {showAddChatPopup: true});
};

const closeAddChatPopup = (state, action) => {
  return updateObject(state, {showAddChatPopup: false});
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NAV_KEY:
      return navKey(state, action);
    case OPEN_ADD_CHAT_POPUP:
      return openAddChatPopup(state, action);
    case CLOSE_ADD_CHAT_POPUP:
      return closeAddChatPopup(state, action);
    default:
      return state;
  }
};

export default reducer;
