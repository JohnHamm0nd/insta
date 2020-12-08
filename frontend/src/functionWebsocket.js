import { SOCKET_URL } from "./Constants"

function WebSocketService() {
  
  const getInstance = () => {
    if (!WebSocketService.instance) {
      websocket = new WebSocket()
      return websocket
    }
    return websocket
  }
  
}


export default 
