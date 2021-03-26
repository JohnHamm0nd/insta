import React from 'react';
import { useDispatch, useSelector } from "react-redux"
import { openAddChatPopup, closeAddChatPopup } from  "../_actions/nav_actions"
import { changeChat } from "../_actions/chat_actions"
import { Button, Modal } from 'antd';
import AddChatUserForm from './AddChatUserForm'


const ChatSidepanel = () => {
    
    const showAddChatPopupFlag = useSelector(state => state.nav.showAddChatPopup)
    const chatList = useSelector(state => state.chat.chats) 
    const dispatch = useDispatch()
    
    const renderChatList = chatList => {
        return chatList.map(c => (
            <div key={c[0].id}>
                {c[0].id}, {c[0].participants}
                <Button
                type='primary'
                style={{ marginBottom: '1rem'}}
                onClick={() => dispatch(changeChat(c[0].id))}
                >
                    채팅
                </Button>
            </div>
        ))
    }
    
    return (
        <div>
            <Modal
                footer={null}
                style={{ top: 200 }}
                visible={showAddChatPopupFlag}
                onCancel={() => {dispatch(closeAddChatPopup())}}
            >
                <AddChatUserForm />
            </Modal>
            <Button type="primary" block onClick={() => {dispatch(openAddChatPopup())}} style={{ marginBottom: '1rem'}}>
                New Chat
            </Button>
            {chatList && renderChatList(chatList)}
        </div>
    )
}

export default ChatSidepanel;
