class MessageHandler {
  constructor(message) {
    switch (message.action) {
      case "ADD_BLOCK":
        this.addBlock(message.data);
        break;
      case "GET_BLOCKCHAIN":
        this.getBlockchain(message.data);
        break;
    }
  }

  addBlock(data) {}

  getBlockchain(data) {}
}

module.exports = MessageHandler;
