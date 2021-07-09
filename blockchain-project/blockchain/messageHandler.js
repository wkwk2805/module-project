const Message = require("./message");
const Transaction = require("./transaction");
const Validation = require("./validation");

class ClientMessageHandler {
  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  onMessage(data) {
    const message = Message.fromJson(data.data);
    switch (message.action) {
      case Message.INIT_BLOCKCHAIN:
        this.initBlockchain(message.data);
        break;
      case Message.SAVE_BLOCKCHAIN:
        this.saveBlockchain(message.data);
        break;
      case Message.ADD_TRANSACTION:
        this.addTransaction(message.data);
      default:
        break;
    }
  }

  initBlockchain(blockchainData) {
    console.log("INIT_BLOCKCHAIN");
    if (blockchainData) this.blockchain.blockchain = blockchainData;
    localStorage.setItem(
      "blockchain",
      JSON.stringify(this.blockchain.blockchain)
    );
    console.log("현재 블록체인: ", this.blockchain.blockchain);
  }

  saveBlockchain(blockchainData) {
    console.log("SAVE_BLOCKCHAIN");
    this.blockchain.blockchain = blockchainData;
    localStorage.setItem("blockchain", JSON.stringify(blockchainData));
    console.log("현재 블록체인: ", this.blockchain.blockchain);
  }

  addTransaction(transactionData) {
    console.log("ADD_TRANSACTION");
    const transaction = new Transaction(transactionData);
    if (transaction.from === "SYSTEM") this.blockchain.transactions = [];
    this.blockchain.addTransaction(transaction);
  }
}

class ServerMessageHandler {
  constructor(broadcast) {
    this.broadcast = broadcast;
    this.rewardAmount = 50;
  }

  onMessage(blockchain, data, req) {
    this.blockchain = blockchain;
    const message = Message.fromJson(data);
    switch (message.action) {
      case Message.END_MINING:
        this.endMining(message.data, req);
        break;
      case Message.ADD_TRANSACTION:
        this.broadcast(message);
        break;
      default:
        break;
    }
  }

  endMining(blockchainData, req) {
    if (this.blockchain.length < blockchainData.length) {
      if (Validation.compareWithAllHashs(blockchainData)) {
        this.blockchain = blockchainData;
        this.reward(req);
        this.saveBlockchain(this.blockchain);
        console.log("블록체인성공: " + req.socket.remoteAddress);
      } else {
        console.log(
          "블록체인실패: 블록체인 내부 해시들 사이의 문제가 있습니다. - " +
            req.socket.remoteAddress
        );
      }
    } else {
      console.log(
        "블록체인실패: blockchain 길이가 문제가 있습니다. - " +
          req.socket.remoteAddress
      );
    }
  }

  reward(req) {
    console.log("보상이 주어졌습니다. - " + req.socket.remoteAddress);
    this.broadcast(
      new Message({
        action: Message.ADD_TRANSACTION,
        data: new Transaction({
          from: "SYSTEM",
          to: req.socket.remoteAddress,
          amount: this.rewardAmount,
        }),
      })
    );
  }

  saveBlockchain(blockchainData) {
    this.broadcast(
      new Message({ action: Message.SAVE_BLOCKCHAIN, data: blockchainData })
    );
  }
}

module.exports = { ClientMessageHandler, ServerMessageHandler };
