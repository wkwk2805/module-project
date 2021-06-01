import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "../service/customAxios";

const Index = () => {
  useEffect(() => {
    init();
  }, []);

  const router = useRouter();

  // 유효 토큰 존재시 로그인 상태 유지 초기화
  const init = async () => {
    const data = (await axios.post("/verify")).data;
    if (data.user) router.push("/success");
  };

  // 로그인 버튼을 통한 로직 구현
  const _onSubmit = async (e) => {
    e.preventDefault();
    const param = {};
    for (let item of e.target) {
      item.name && (param[item.name] = item.value);
    }
    const data = (await axios.post("/login", param)).data;
    if (data.ok) {
      localStorage.setItem("token", data.token);
      router.push("/success");
    } else {
      alert("로그인 실패");
    }
  };
  return (
    <form style={{ textAlign: "center" }} onSubmit={_onSubmit}>
      <div>
        <label htmlFor="id">아이디:</label>
        <input type="text" id="id" name="id" />
      </div>
      <div>
        <label htmlFor="pw">비밀번호:</label>
        <input type="password" id="pw" name="password" />
      </div>
      <div>
        <button type="submit">로그인</button>
      </div>
      <div>
        <Link href="/register">회원가입</Link>
      </div>
    </form>
  );
};

export default Index;
