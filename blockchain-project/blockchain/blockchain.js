const { BN } = require("bn.js");
const Block = require("./block");
const Transaction = require("./transaction");

class BlockChain {
  HANDICAP = 0x4000000;

  constructor() {
    this.blockchain = [Block.getGenesis()];
    this.transactions = [];
  }

  addBlock(block) {
    this.blockchain.push(block);
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getTarget(bits) {
    let bits16 = parseInt("0x" + bits.toString(16), 16);
    let exponent = bits16 >> 24;
    let mantissa = bits16 & 0xffffff;
    let target = mantissa * 2 ** (8 * (exponent - 3));
    let target16 = target.toString(16);
    let k = Buffer.from("0".repeat(64 - target16.length) + target16, "hex");
    return k.toString("hex");
  }

  getTargetHaveHandicap(bits) {
    return this.getTarget(bits + this.HANDICAP);
  }

  bitsToDifficulty(bits) {
    const maximumTarget = "0x00000000ffff" + "0".repeat(64 - 12);
    const currentTarget = "0x" + this.getTarget(bits);
    return parseInt(maximumTarget, 16) / parseInt(currentTarget, 16);
  }

  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  mining() {
    const lastBlock = this.getLastBlock();
    const block = "";
    const newBlock = new Block({
      index: lastBlock.index + 1,
      previousHash: lastBlock.hash,
      timestamp: Date.now(),
      transactions: this.transactions,
      nonce: 0,
    });
    const bits = lastBlock.bits;
    const target = this.getTargetHaveHandicap(bits);
    while (target <= newBlock.getHash()) {
      newBlock.nonce++;
    }
    const difficulty = this.getDifficulty(bits);
    newBlock.hash = newBlock.getHash();
    newBlock.difficulty = difficulty;
    newBlock.bits = this.difficultyToBits(difficulty);
    this.addBlock(newBlock);
    this.transactions = [];
  }

  getDifficulty(bits) {
    const wantedTime = 10;
    const wantedBlockCount = 10;
    let difficulty = this.bitsToDifficulty(bits);
    const lastBlock = this.getLastBlock();
    if (lastBlock.index > 0 && lastBlock.index % wantedBlockCount == 0) {
      console.log(`10개 시간 비교`);
      let reTargetTime =
        this.blockchain[this.blockchain.length - wantedBlockCount].timestamp;
      let lastTime = lastBlock.timestamp;
      let elaspedTime = (lastTime - reTargetTime) / wantedBlockCount / 1000;
      console.log(`시간 비교 값: ${elaspedTime}초`);
      let multiple = elaspedTime > wantedTime ? 0.25 : 4;
      difficulty = difficulty * multiple;
      console.log(`최종 난이도: ${difficulty}`);
    }
    return difficulty;
  }

  getBits() {
    this.difficultyToBits(this.getDifficulty());
  }

  difficultyToBits(difficulty) {
    const maximumTarget = "0x00000000ffff" + "0".repeat(64 - 12);
    const difficulty16 = difficulty.toString(16);
    let target = parseInt(maximumTarget, 16) / parseInt(difficulty16, 16);
    let num = new BN(target.toString(16), "hex");
    let compact, nSize, bits;
    nSize = num.byteLength();
    if (nSize <= 3) {
      compact = num.toNumber();
      compact <<= 8 * (3 - nSize);
    } else {
      compact = num.ushrn(8 * (nSize - 3)).toNumber();
    }
    if (compact & 0x800000) {
      compact >>= 8;
      nSize++;
    }
    bits = (nSize << 24) | compact;
    if (num.isNeg()) {
      bits |= 0x800000;
    }
    bits >>>= 0;
    return parseInt(bits.toString(10));
  }
}

const blockchain = new BlockChain();
do {
  blockchain.mining();
} while (blockchain.blockchain.length <= 60);

console.log(JSON.parse(JSON.stringify(blockchain.blockchain)));

module.exports = BlockChain;
