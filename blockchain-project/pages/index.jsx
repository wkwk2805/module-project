import React, { useEffect } from "react";
import BlockChain from "../blockchain/blockchain";
import Transaction from "../blockchain/transaction";

const blockchain = new BlockChain();
const index = () => {
  let ws;
  let isStop = false;

  useEffect(() => {
    localStorage.setItem("blockchain", JSON.stringify(blockchain.blockchain));
    ws = new WebSocket("ws://192.168.0.19:8080");
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "BLOCKCHAIN") {
        localStorage.setItem("blockchain", data.blockchain);
      } else if (data.type === "TRANSACTION") {
        blockchain.addTransaction(new Transaction(data.transaction));
      }
    };
  }, []);

  const start = async () => {
    isStop = false;
    while (!isStop) {
      await blockchain.mining(isStop);
      ws.send(
        JSON.stringify({
          type: "BLOCKCHAIN",
          blockchain: blockchain.blockchain,
        })
      );
    }
  };

  const stop = () => {
    isStop = true;
  };

  const send = () => {
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
          <button onClick={send}>send</button>
        </div>
      </div>
      <h1>Mining Page</h1>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
};

export default index;
