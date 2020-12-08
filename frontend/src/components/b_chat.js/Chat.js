import React, { useEffect, useState, useRef } from 'react'
import ChatSidepanel from './ChatSidepanel'
import { Input } from 'antd'
//import WebSocketInstance from "../websocket"
import { SOCKET_URL } from "../Constants"

function Chat() {
  
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState()
  //WebSocketInstance.connect('text')
  
  //const sendMessage = (messageData) => {
    //console.log(messageData)
    //let message = {'message': messageData}
    //WebSocketInstance.sendMessage(message)
  //}

  
    //return (
      //<div>
        //{window.location.host}
        //<ChatSidepanel />
        //Chat
        //<div>
          //{messages}
        //</div>
        //<div>
          //<Input.Search
            //placeholder="Write your message..."
            //enterButton="Send"
            //onSearch={messageData => sendMessage(messageData)}
          ///>
        //</div>
      //</div>
    //)
    
  //const initialiseChat = () => {
    //waitForSocketConnection(() => {
      //WebSocketInstance.fetchMessages(
        //'user',
        //'test'
      //)
    //})
    //WebSocketInstance.connect('test')
  //}

  //const waitForSocketConnection = (callback) => {
    //const component = this;
    //setTimeout(function() {
      //if (WebSocketInstance.state() === 1) {
        //console.log("Connection is made");
        //callback();
        //return;
      //} else {
        //console.log("wait for connection...");
        //component.waitForSocketConnection(callback);
      //}
    //}, 1000);
  //}

  //const messageChangeHandler = event => {
    //setMessage(event.target.value)
  //};

  //const sendMessageHandler = e => {
    //const messageObject = {
      //from: 'user',
      //content: message,
      //chatId: 'test'
    //};
    //WebSocketInstance.newChatMessage(messageObject);
    //setMessage('')
  //};

  
  //const renderTimestamp = timestamp => {
    //let prefix = "";
    //const timeDiff = Math.round(
      //(new Date().getTime() - new Date(timestamp).getTime()) / 60000
    //);
    //if (timeDiff < 1) {
       //less than one minute ago
      //prefix = "just now...";
    //} else if (timeDiff < 60 && timeDiff > 1) {
       //less than sixty minutes ago
      //prefix = `${timeDiff} minutes ago`;
    //} else if (timeDiff < 24 * 60 && timeDiff > 60) {
       //less than 24 hours ago
      //prefix = `${Math.round(timeDiff / 60)} hours ago`;
    //} else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
       //less than 7 days ago
      //prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    //} else {
      //prefix = `${new Date(timestamp)}`;
    //}
    //return prefix;
  //};

  //const renderMessages = messages => {
    //const currentUser = 'user'
    //return messages.map((message, i, arr) => (
      //<li
        //key={message.id}
        //style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
        //className={message.author === currentUser ? "sent" : "replies"}
      //>
        //<img
          //src="http://emilcarlsson.se/assets/mikeross.png"
          //alt="profile-pic"
        ///>
        //<p>
          //{message.content}
          //<br />
          //<small>{renderTimestamp(message.timestamp)}</small>
        //</p>
      //</li>
    //));
  //};
  
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages])
  
  //useEffect(() => {
    //scrollToBottom()
  //}, [messages])
  
  //useEffect(() => {
    //initialiseChat()
  //}, [])
  
  const webSocket = useRef(null)
  
  useEffect(() => {
    webSocket.current = new WebSocket(`${SOCKET_URL}/ws/chat/test/`)
    webSocket.current.onopen = () => {
      console.log("WebSocket open")
    }
    webSocket.current.onmessage = (message) => {
      //console.log(message.data)
      setMessages(prev => [...prev, message.data])
    }
    return () => webSocket.current.close()
  }, []);
  
  const messageChangeHandler = (event) => {
    setMessage(event.target.value)
  }
  
  const sendMessageHandler = () => {
    console.log(message)
    webSocket.current.send(JSON.stringify({message: message}))
    setMessage('')
  }
  
  return (
    <div>
      <div style={{height: '400px', overflowY: 'scroll'}}>
        {messages.map((msg, index) => (<div key={index}>{msg}</div>))}
        <div ref={messagesEndRef} />
        <Input.Search
          value={message}
          onChange={messageChangeHandler}
          onSearch={sendMessageHandler}
          required
          enterButton="Send"
          id="chat-message-input"
          type="text"
          placeholder="Write your message..."
        />
      </div>
    </div>
  );
}

export default Chat
