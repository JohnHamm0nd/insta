import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from "react-redux"
import { Input } from 'antd'
import WebSocketInstance from "../websocket"
import './Chat.scss'

function Chat() {

  const User = useSelector(state => state.user)
  const chatID = useSelector(state => state.chat.chatID)
  const Messages = useSelector(state => state.chat.messages)
  const avatarUrl = useSelector(state => state.chat.avatar_url)
  const previousLoad = useSelector(state => state.chat.previousLoad)
  
  const [message, setMessage] = useState({message: ''})
  
  const [scrollHeight, setScrollHeight] = useState()

  const initialiseChat = () => {
    if ( chatID ) {
      if (WebSocketInstance.socketRef) {
        WebSocketInstance.disconnect()
      }
      waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(
           User.userData.data.user.username,
           chatID,
        );
      })
      WebSocketInstance.connect(chatID)
    }
  }
  
  useEffect(initialiseChat, [chatID])
  const waitForSocketConnection = (callback) => {
    setTimeout(function() {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        waitForSocketConnection(callback);
      }
    }, 2000);
  }
  const messageChangeHandler = event => {
    setMessage({ message: event.target.value });
  };

  const sendMessageHandler = e => {
    const messageObject = {
      from: User.userData.data.user.username,
      content: message,
      chatId: chatID,
    };
    WebSocketInstance.newChatMessage(messageObject)
    setMessage({ message: "" })
  };

  const renderTimestamp = timestamp => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      prefix = "just now";
    } else if (timeDiff < 60 && timeDiff > 1) {
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const renderMessages = messages => {
    const currentUser = User.userData.data.user.username
    return messages.map((message, i, arr) => (
      <li
        key={message.id}
        style={{ listStyle:"none", marginBottom: "15px", marginRight: "10px" }}
        className={message.author === currentUser ? "sent" : "replies"}
      >
        {message.author === currentUser ? null :
          <img
            src={avatarUrl}
            alt="profile-pic"
            style={{width: '42px', borderRadius: '50%', float: 'left', margin: '6px'}}
          />
        }
        {message.author === currentUser ? null : <p style={{marginLeft: '60px', marginBottom: '0px', fontSize: '14px'}}>{message.author}</p>}
        <div>          
          {message.content}
          <br />
          <small>{renderTimestamp(message.timestamp)}</small>
        </div>
      </li>
    ))
  }

  const messagesEndRef = useRef(null)
  
  const scrollToBottom = (preScrollHeight) => {
    if (!previousLoad) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    } else {
      preMessagesRef.current.scrollTo(0, preMessagesRef.current.scrollHeight - preScrollHeight)
    }
  };

  useEffect(() => {scrollToBottom(scrollHeight)}, [Messages])
  
  
  const preMessagesRef = useRef(null)
  const infiniteScroll = () => {
    const scrollTop = preMessagesRef.current.scrollTop
    const scrollHeight = preMessagesRef.current.scrollHeight
    if (scrollTop === 0 && scrollHeight > 800) {
      setScrollHeight(scrollHeight)
      WebSocketInstance.previousMessages(chatID, preMessagesRef.current.childElementCount-1)
    }
  }
  
  useEffect(() => {
      preMessagesRef.current.addEventListener("scroll", infiniteScroll, true)
      return () => preMessagesRef.current.removeEventListener("scroll", infiniteScroll, true)
  }, [chatID])
  
  return (
    <div>
    <div
      style={{overflow: 'scroll', overflowX:'hidden', height: '800px'}}
      ref={preMessagesRef}
    >
      {Messages && renderMessages(Messages)}
      <div ref={messagesEndRef}></div>
      
    </div>
    <Input.Search
        value={message.message}
        onChange={messageChangeHandler}
        onSearch={sendMessageHandler}
        style={{padding: '10px'}}
        allowClear
        enterButton="Send"
        id="chat-message-input"
        type="text"
        placeholder="Write your message..."
      />
    </div>
  )
}

export default Chat
