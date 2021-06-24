class Transaction {
  constructor(data) {
    this.from = data.from;
    this.to = data.to;
    this.account = data.account;
    this.timestamp = Date.now();
  }
}

module.exports = Transaction;
