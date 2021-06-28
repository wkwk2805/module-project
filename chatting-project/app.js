const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: "8080" });
let messages = [];
let clients = {};

wss.on("connection", (ws, req) => {
  clients[req.socket.remoteAddress] = ws;
  ws.send(messages === [] ? JSON.stringify(messages) : messages);
  ws.on("message", (data) => onMessage(data, ws, wss));
  ws.on("error", onError);
  ws.on("close", onClose);
  ws.on("open", onOpen);
});

const onMessage = (message, ws, wss) => {
  messages = message;
  sendMessageSpecialUser(wss, ws, message);
};

const onError = (err) => {
  console.log(err);
};

const onClose = (d) => {
  console.log("Close", d);
};

const onOpen = (d) => {
  console.log("Open", d);
};

const broadcast = (wss, ws, message) => {
  console.log("broadcast message: ", message);
  wss.clients.forEach((client) => {
    console.log(client);
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const broadcastExcludeMyself = (wss, ws, message) => {
  console.log("broadcastExcludeMyself message: ", message);
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const sendMessageSpecialUser = (wss, ws, message, remoteAddress) => {
  wss.clients.forEach((client) => {
    if (
      client === clients[remoteAddress] &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(message);
    }
  });
};
