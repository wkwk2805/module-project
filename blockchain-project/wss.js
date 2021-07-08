const WebSocket = require("ws");
const Message = require("./blockchain/message");
const { ServerMessageHandler } = require("./blockchain/messageHandler");
const Transaction = require("./blockchain/transaction");
const Validation = require("./blockchain/validation");
const wss = new WebSocket.Server({ port: "8080" });
let clients = {};
let blockchain = [];

wss.on("connection", (ws, req) => {
  initialConnection(ws, req);
  ws.on("message", (data) =>
    new ServerMessageHandler(blockchain, broadcast).onMessage(data, req)
  );
  ws.on("error", onError);
  ws.on("close", () => onClose(req));
  ws.on("open", onOpen);
});

const initialConnection = (ws, req) => {
  clients[req.socket.remoteAddress] = ws;
  ws.send(
    JSON.stringify(
      new Message({
        action: Message.INIT_BLOCKCHAIN,
        data: blockchain.length > 0 ? blockchain : undefined,
      })
    )
  );
};

const onError = (err) => {
  console.log(err);
};

const onClose = (req) => {
  console.log("Close");
  delete clients[req.socket.remoteAddress];
};

const onOpen = (d) => {
  console.log("Open", d);
};

const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
