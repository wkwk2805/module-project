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
    if (blockchain.length !== newBlock.index)
      console.log("블록체인의 길이와 새로운블록의 인덱스가 다릅니다.");
    return blockchain.length === newBlock.index;
  }

  static compareWithHashs(blockchain, newBlock) {
    if (blockchain[blockchain.length - 1].hash !== newBlock.previousHash)
      console.log(
        "마지막 블록의 현재 해쉬와 새로운블록의 이전해쉬가 다릅니다!"
      );
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
    if (newBlock.hash !== newBlock.getHash())
      console.log("블록의 정보와 해쉬의 값이 일치하지 않습니다.");
    return newBlock.hash === newBlock.getHash();
  }
}

module.exports = Validation;
