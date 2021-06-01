import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = (await axios.get("/files")).data;
      setFiles(data);
    })();
  }, []);

  const _onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);
    const res = (await axios.post("/upload_single", formData)).data;
    if (!res.ok) alert("파일 업로드 실패");
    e.target.file.value = "";
  };

  const _onSubmit2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let item of e.target.files.files) {
      formData.append("files", item);
    }
    const res = (await axios.post("/upload_array", formData)).data;
    if (!res.ok) alert("파일 업로드 실패");
    e.target.files.value = "";
  };

  const remove = async (fileName) => {
    const data = (await axios.post("/remove_file", { fileName })).data;
    setFiles(data);
  };

  const download = (fileName) => {
    open("/download?fileName=" + fileName);
  };

  return (
    <div>
      <form onSubmit={_onSubmit}>
        <input type="file" name="file" id="file" />
        <button type="submit">single 업로드</button>
      </form>
      <form onSubmit={_onSubmit2}>
        <input type="file" name="files" id="files" multiple />
        <button type="submit">multiple 업로드</button>
      </form>
      <div>
        {files.map((e, i) => (
          <div key={i}>
            {e} <button onClick={(x) => remove(e)}>삭제</button>{" "}
            <button onClick={(x) => download(e)}>다운로드</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
