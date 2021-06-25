const fs = require("fs");

const slowResolve = (val) =>
  new Promise((resolve) => setTimeout(resolve.bind(null, val), 0));

longLoop().then((res) => console.log("loop result processing started"));

console.log("read file started");

fs.onload = () => console.log("file processing started");
fs.src =
  "https://images.pexels.com/photos/34950/pexels-photo.jpg?h=350&auto=compress&cs=tinysrgb";

setTimeout(() => console.log("timer fires"), 500);

async function longLoop() {
  console.log("loop started");
  let res = 0;
  for (let i = 0; i < 1e7; i++) {
    res += Math.sin(i); // arbitrary computation heavy operation
    if (i % 1e5 === 0) await slowResolve(i);
  }
  console.log("loop finished");
  return res;
}
