import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"
import ChatSidepanel from './ChatSidepanel'
import { Input } from 'antd'
import WebSocketInstance from "../websocket"

function Chat() {
  
  const Post = useSelector(state => state.post)
  
  const [message, setMessage] = useState({message: ''})
  
  const initialiseChat = () => {
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(
        // this.props.username,
        // this.props.match.params.chatID
        'username',
        1
      );
    })
    WebSocketInstance.connect('test')
  }
  
  useEffect(initialiseChat, [])

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
    e.preventDefault();
    const messageObject = {
      from: 'username',
      content: message,
      chatId: 'chatId'
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
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const renderMessages = messages => {
    const currentUser = 'username'
    return messages.map((message, i, arr) => (
      <li
        key={message.id}
        style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
        className={message.author === currentUser ? "sent" : "replies"}
      >
        <img
          src="http://emilcarlsson.se/assets/mikeross.png"
          alt="profile-pic"
          style={{width: '100px'}}
        />
        <p>
          {message.caption}
          <br />
          <small>{renderTimestamp(message.timestamp)}</small>
        </p>
      </li>
    ));
  };
  
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [Post])
  
  return (
    <div>
      {Post && renderMessages(Post.postList.results)}
      <div ref={messagesEndRef} />
      <Input.Search
        value={message.message}
        onChange={messageChangeHandler}
        onSearch={sendMessageHandler}
        required
        enterButton="Send"
        id="chat-message-input"
        type="text"
        placeholder="Write your message..."
      />
    </div>
  )
}

export default Chat
