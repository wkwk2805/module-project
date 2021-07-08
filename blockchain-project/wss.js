const WebSocket = require("ws");
const Message = require("./blockchain/message");
const Transaction = require("./blockchain/transaction");
const Validation = require("./blockchain/validation");
const wss = new WebSocket.Server({ port: "8080" });
let clients = {};
let blockchain = [];

wss.on("connection", (ws, req) => {
  initialConnection(ws, req);
  ws.on("message", (data) => onMessage(data, ws, req));
  ws.on("error", onError);
  ws.on("close", () => onClose(req));
  ws.on("open", onOpen);
});

const initialConnection = (ws, req) => {
  clients[req.socket.remoteAddress] = ws;
  ws.send(
    JSON.stringify(
      new Message({
        action: Message.SAVE_BLOCKCHAIN,
        data: blockchain.length > 0 ? blockchain : undefined,
      })
    )
  );
};

const onMessage = (data, ws, req) => {
  const message = Message.fromJson(data);
  switch (message.action) {
    case Message.SYNC_BLOCKCHAIN:
      blockchain = message.data;
      broadcast(
        new Message({ action: Message.SAVE_BLOCKCHAIN, data: blockchain })
      );
      break;
    case Message.END_MINING:
      if (
        blockchain.length < message.data.length &&
        Validation.compareWithAllHashs(message.data)
      ) {
        blockchain = message.data;
        broadcast(
          new Message({
            action: Message.ADD_TRANSACTION,
            data: new Transaction({
              from: "SYSTEM",
              to: req.socket.remoteAddress,
              amount: 50,
            }),
          })
        );
        broadcast(
          new Message({ action: Message.END_MINING, data: blockchain })
        );
      }
      break;
    case Message.ADD_TRANSACTION:
      broadcast(message);
    default:
      break;
  }
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

const sendMessageSpecificUser = (message) => {
  console.log("sendMessageSpecificUser");
  wss.clients.forEach((client) => {
    if (
      client === clients[message.specificUser] &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(JSON.stringify(message));
    }
  });
};
