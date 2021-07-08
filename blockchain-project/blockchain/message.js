class Message {
  static SAVE_BLOCKCHAIN = "SAVE_BLOCKCHAIN";
  static SYNC_BLOCKCHAIN = "SYNC_BLOCKCHAIN";
  static END_MINING = "END_MINING";
  static ADD_TRANSACTION = "ADD_TRANSACTION";

  constructor(obj) {
    this.type = obj.type;
    this.action = obj.action;
    this.data = obj.data;
    this.specificUser = obj.specificUser;
  }

  static fromJson(str) {
    const obj = JSON.parse(str);
    return new Message(obj);
  }
}

module.exports = Message;
