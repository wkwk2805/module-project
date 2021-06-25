const send = async () => {
  const result = await axios.get("http://localhost:3000");
  console.log(result);
};

const stop = async () => {
  const result = await axios.get("http://localhost:3000/stop");
  console.log(result);
};
