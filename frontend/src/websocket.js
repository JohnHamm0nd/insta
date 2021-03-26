import { SOCKET_URL } from "./Constants"

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(chatUrl) {
    const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    //~ this.socketRef.onclose = () => {
      //~ console.log("WebSocket closed let's reopen");
      //~ this.connect();
    //~ };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    //~ console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.avatar_url, parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
    if (command === "previous_messages") {
      this.callbacks[command](parsedData.messages);
    }
  }

  fetchMessages(username, chatId) {
    this.sendMessage({
      command: "fetch_messages",
      username: username,
      chatId: chatId
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      from: message.from,
      message: message.content.message,
      chatId: message.chatId
    });
  }
  
  previousMessages(chatId, messageCount) {
    //~ console.log(chatId, messageCount)
    this.sendMessage({
      command: "previous_messages",
      chatId: chatId,
      messageCount: messageCount
    });
  }
  
  addCallbacks(messagesCallback, newMessageCallback, previousMessagesCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
    this.callbacks["previous_messages"] = previousMessagesCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
