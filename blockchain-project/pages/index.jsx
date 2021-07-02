import React, { useEffect } from "react";
import BlockChain from "../blockchain/blockchain";
import Transaction from "../blockchain/transaction";

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
    downloadInitBlockchain();
  };

  const downloadInitBlockchain = () => {
    ws.send("DOWNLOAD_BLOCKCHAIN");
  };

  const onMessage = (message) => {
    const data = JSON.parse(message.data);
    switch (data.type) {
      case "ADD_BLOCK":
        addBlock(data.newBlock);
        break;
      case "TRANSACTION":
        addTransaction(data.transaction);
        break;
    }
  };

  const addBlock = (block) => {
    blockchain.addBlock(block);
    localStorage.setItem("blockchain", blockchain.blockchain);
  };

  const addTransaction = (transaction) => {
    blockchain.addTransaction(new Transaction(transaction));
  };

  const startMining = async () => {
    isStop = false;
    while (!isStop) {
      const newBlock = await blockchain.mining(isStop);
      ws.send(
        JSON.stringify({
          type: "ADD_BLOCK",
          newBlock,
        })
      );
    }
  };

  const stopMining = () => {
    isStop = true;
  };

  const sendTransactionData = () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const amount = document.getElementById("amount").value;
    ws.send(
      JSON.stringify({ type: "TRANSACTION", transaction: { from, to, amount } })
    );
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
