import WebSocket = require("ws");

export interface ExtWebSocket extends WebSocket {
  id?: string;
}
