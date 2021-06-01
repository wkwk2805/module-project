import axios from "../service/customAxios";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  // 유효 토큰 존재시 로그인 상태 유지 초기화
  const init = async () => {
    const data = (await axios.post("/verify")).data;
    if (data.user) router.push("/success");
  };

  const _onSubmit = async (e) => {
    e.preventDefault();
    const param = {};
    for (let item of e.target) {
      item.name && (param[item.name] = item.value);
    }
    const data = (await axios.post("/register", param)).data;
    if (data.ok) {
      localStorage.setItem("token", data.token);
      router.push("/success");
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
        <button type="submit">회원가입</button>
      </div>
    </form>
  );
};

export default Register;
