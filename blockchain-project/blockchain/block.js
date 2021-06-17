const hashs = require("hash.js");

class Block {
  constructor(data) {
    if (!data) return;
    this.index = data.index;
    this.previousHash = data.previousHash;
    this.timestamp = data.timestamp;
    this.nonce = data.nonce;
    this.transactions = data.transactions;
    this.bits = data.bits;
    this.hash = this.getHash();
    this.difficulty = this.difficulty;
  }

  static getGenesis() {
    return new Block({
      index: 0,
      previousHash: 0,
      timestamp: Math.floor(new Date().getTime() / 1000),
      nonce: 0,
      transactions: [],
      bits: 486604799,
    });
  }

  getHash() {
    return hashs
      .sha256()
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce +
          this.bits
      )
      .digest("hex");
  }
}

module.exports = Block;
