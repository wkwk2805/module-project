import React, { useEffect } from "react";
import BlockChain from "../blockchain/blockchain";
import Transaction from "../blockchain/transaction";
import Message from "../blockchain/message";

const blockchain = new BlockChain();

const Index = () => {
  let ws;
  let isStop = false;
  let websocketServerUrl = "192.168.0.19:8080";

  useEffect(() => {
    inital();
  }, []);

  const inital = () => {
    localStorage.setItem("blockchain", JSON.stringify(blockchain.blockchain));
    ws = new WebSocket(`ws://${websocketServerUrl}`);
    ws.onmessage = onMessage;
  };

  const initBlockchain = (blockchainData) => {
    console.log("INIT_BLOCKCHAIN");
    if (blockchainData) blockchain.blockchain = blockchainData;
    localStorage.setItem("blockchain", JSON.stringify(blockchain.blockchain));
    console.log("현재 블록체인: ", blockchain.blockchain);
  };

  const saveBlockchain = (blockchainData) => {
    console.log("SAVE_BLOCKCHAIN");
    blockchain.blockchain = blockchainData;
    localStorage.setItem("blockchain", JSON.stringify(blockchainData));
    console.log("현재 블록체인: ", blockchain.blockchain);
  };

  const addTransaction = (transactionData) => {
    console.log("ADD_TRANSACTION");
    const transaction = new Transaction(transactionData);
    if (transaction.from === "SYSTEM") blockchain.transactions = [];
    blockchain.addTransaction(transaction);
  };

  const onMessage = (data) => {
    const message = Message.fromJson(data.data);
    switch (message.action) {
      case Message.INIT_BLOCKCHAIN:
        initBlockchain(message.data);
        break;
      case Message.SAVE_BLOCKCHAIN:
        saveBlockchain(message.data);
        break;
      case Message.ADD_TRANSACTION:
        addTransaction(message.data);
      default:
        break;
    }
  };

  const send = (data) => {
    ws.send(JSON.stringify(new Message(data)));
  };

  const startMining = async () => {
    console.log("startMining");
    isStop = false;
    while (!isStop) {
      const newBlock = await blockchain.mining(isStop);
      blockchain.addBlock(newBlock);
      send({ action: Message.END_MINING, data: blockchain.blockchain });
    }
  };

  const stopMining = () => {
    console.log("stopMining");
    isStop = true;
  };

  const sendTransactionData = () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const amount = document.getElementById("amount").value;
    send({
      action: Message.ADD_TRANSACTION,
      data: new Transaction({ from, to, amount }),
    });
  };

  return (
    <div>
      <h1>Transaction Page</h1>
      <div>
        <div>
          <label htmlFor="from">From: </label>
          <input type="text" id="from" />
        </div>
        <div>
          <label htmlFor="to">To: </label>
          <input type="text" id="to" />
        </div>
        <div>
          <label htmlFor="amount">Amount: </label>
          <input type="text" id="amount" />
        </div>
        <div>
          <button onClick={sendTransactionData}>sendTransactionData</button>
        </div>
      </div>
      <h1>Mining Page</h1>
      <button onClick={startMining}>startMining</button>
      <button onClick={stopMining}>stopMining</button>
    </div>
  );
};

export default Index;
