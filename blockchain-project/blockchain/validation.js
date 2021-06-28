const hashs = require("hash.js");

class Validation {
  static compareWithAllHashs(blockchain) {
    for (let i = 0; i < blockchain.length; i++) {
      if (
        i + 1 !== blockchain.length &&
        blockchain[i + 1].previousHash !== blockchain[i].hash &&
        this.compareHashAndData(blockchain[i])
      ) {
        return false;
      }
      return true;
    }
  }

  static compareWithLength(blockchain, newBlock) {
    return blockchain.length === newBlock.index;
  }

  static compareWithHashs(blockchain, newBlock) {
    return blockchain[blockchain.length - 1].hash === newBlock.previousHash;
  }

  static isValidBlock(blockchain, newBlock) {
    return (
      this.compareWithHashs(blockchain, newBlock) &&
      this.compareWithLength(blockchain, newBlock) &&
      this.compareHashAndData(newBlock)
    );
  }

  static compareHashAndData(newBlock) {
    return newBlock.hash === newBlock.getHash();
  }
}

module.exports = Validation;
