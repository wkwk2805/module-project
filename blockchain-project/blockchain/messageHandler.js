const Message = require("./message");

class MessageHandler {
  handler(messageStr) {
    const message = Message.fromJson(messageStr);
    this.message = message;
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
