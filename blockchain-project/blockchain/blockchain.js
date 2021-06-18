const { BN } = require("bn.js");
const Block = require("./block");

class BlockChain {
  HANDICAP = 0x4000000;

  constructor() {
    this.blockchain = [];
  }

  addBlock(block) {
    this.blockchain.push(block);
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

  mining(block) {
    const bits = block.bits;
    const target = this.getTargetHaveHandicap(bits);
    while (target <= block.getHash()) {
      block.nonce++;
    }
    return { nonce: block.nonce, hash: block.getHash() };
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
