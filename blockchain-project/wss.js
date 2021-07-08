const WebSocket = require("ws");
const Message = require("./blockchain/message");
const Transaction = require("./blockchain/transaction");
const Validation = require("./blockchain/validation");
const wss = new WebSocket.Server({ port: "8080" });
let clients = {};
let blockchain = [];

wss.on("connection", (ws, req) => {
  initialConnection(ws, req);
  ws.on("message", (data) => onMessage(data, req));
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

const endMining = (blockchainData, req) => {
  if (blockchain.length < blockchainData.length) {
    if (Validation.compareWithAllHashs(blockchainData)) {
      blockchain = blockchainData;
      reward(req);
      saveBlockchain(blockchain);
      console.log("블록체인성공: " + req.socket.remoteAddress);
    } else {
      console.log("블록체인실패: 블록체인 내부 해시들 사이의 문제가 있습니다.");
    }
  } else {
    console.log("블록체인실패: blockchain 길이가 문제가 있습니다.");
  }
};

const reward = (req) => {
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
};

const saveBlockchain = (blockchainData) => {
  broadcast(
    new Message({ action: Message.SAVE_BLOCKCHAIN, data: blockchainData })
  );
};

const onMessage = (data, req) => {
  const message = Message.fromJson(data);
  switch (message.action) {
    case Message.END_MINING:
      endMining(message.data, req);
      break;
    case Message.ADD_TRANSACTION:
      broadcast(message);
      break;
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
