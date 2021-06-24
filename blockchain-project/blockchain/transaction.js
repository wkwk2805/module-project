class Transaction {
  constructor(data) {
    this.from = data.from;
    this.to = data.to;
    this.price = data.price;
    this.timestamp = Date.now();
  }
}

module.exports = Transaction;
