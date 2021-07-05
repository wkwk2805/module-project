const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: "8080" });
let messages = [];
let clients = {};

wss.on("connection", (ws, req) => {
  clients[req.socket.remoteAddress] = ws;
  ws.send(messages === [] ? JSON.stringify(messages) : messages);
  ws.on("message", (data) => onMessage(data, ws));
  ws.on("error", onError);
  ws.on("close", onClose);
  ws.on("open", onOpen);
});

const onMessage = (message, ws) => {
  switch (message.type) {
    case "BROADCAST":
      broadcast(message);
      break;
    case "BROADCAST_EXCLUDE_MYSELF":
      broadcastExcludeMyself(message, ws);
      break;
    case "SEND_MESSAGE_TO_SPECIAL_USER":
      sendMessageSpecialUser(message);
  }
  broadcast(message);
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

const broadcast = (message) => {
  console.log("broadcast");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const broadcastExcludeMyself = (message, ws) => {
  console.log("broadcastExcludeMyself");
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const sendMessageSpecialUser = (message) => {
  console.log("sendMessageSpecialUser");
  wss.clients.forEach((client) => {
    if (
      client === clients[message.data.remoteAddress] &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(message);
    }
  });
};
