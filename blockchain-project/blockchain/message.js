class Message {
  constructor(obj) {
    this.type = obj.type;
    this.action = obj.action;
    this.data = obj.data;
  }

  static fromJson(str) {
    const obj = JSON.parse(str);
    return new Message(obj);
  }
}

module.exports = Message;
