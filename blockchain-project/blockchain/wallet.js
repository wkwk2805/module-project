class Wallet {
  constructor(blockchain) {
    const blocks = blockchain.blockchain;
    this.transactions = blocks
      .map((block) => block.transactions)
      .reduce((acc, cur) => acc.concat(cur));
  }
  getMyPrice(user) {
    let from = this.transactions
      .filter((e) => e.from == user)
      .map((e) => e.price)
      .reduce((acc, cur) => acc * 1 + cur * 1, 0);
    let to = this.transactions
      .filter((e) => e.to == user)
      .map((e) => e.price)
      .reduce((acc, cur) => acc * 1 + cur * 1, 0);
    const price = to - from;
    console.log(`${user}님의 남아있는 코인은 : ${price}coin입니다`);
    return price;
  }
}

module.exports = Wallet;
