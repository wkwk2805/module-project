const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: "8080" });
let messages = [];

wss.on("connection", (ws) => {
  ws.send(messages === [] ? JSON.stringify(messages) : messages);
  ws.on("message", (data) => onMessage(data, ws, wss));
  ws.on("error", onError);
  ws.on("close", onClose);
  ws.on("open", onOpen);
});

const onMessage = (message, ws, wss) => {
  messages = message;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
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
