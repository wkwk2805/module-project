import React, { useEffect, useRef, useState } from "react";

const Index = () => {
  const [ws, setWs] = useState();
  const [texts, setTexts] = useState([]);
  const ref = useRef("");
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (data) => {
      setTexts(JSON.parse(data.data));
    };
    setWs(ws);
  }, []);
  const send = () => {
    ws.send(JSON.stringify([...texts, ref.current.value]));
    ref.current.value = "";
  };
  return (
    <div>
      <div id="text_field">
        {texts.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </div>
      <input type="text" ref={ref} />
      <input type="button" value="send" onClick={send} />
    </div>
  );
};

export default Index;
