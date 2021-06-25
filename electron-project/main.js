const { app, BrowserWindow } = require("electron");
const express = require("express");
const server = express();
const BlockChain = require("../blockchain-project/blockchain/blockchain");
const blockchain = new BlockChain();
let isStop = false;

server.get("/", (req, res) => {
  longLoop();
});

server.get("/stop", (req, res) => {
  isStop = true;
  res.send("stop");
});

const longLoop = async () => {
  isStop = false;
  while (blockchain.blockchain.length <= 100) {
    await blockchain.mining();
    if (isStop) return;
  }
};

server.listen(3000, () => {
  console.log("Connected");
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
