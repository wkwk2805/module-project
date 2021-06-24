import React, { useEffect } from "react";
import BlockChain from "../blockchain/blockchain";
const block = new BlockChain();

const index = () => {
  let interval;
  const x = async () => {
    interval = setInterval(() => {
      block.mining();
    }, 0);
  };
  const y = async () => {
    clearInterval(interval);
  };
  return (
    <div>
      <button onClick={x}>start</button>
      <button onClick={y}>stop</button>
    </div>
  );
};

export default index;
