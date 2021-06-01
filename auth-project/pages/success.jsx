import axios from "../service/customAxios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Success = () => {
  useEffect(() => {
    init();
  }, []);
  const [user, setUser] = useState({});
  const router = useRouter();

  // 로그아웃시 토큰제거 후 로그인 페이지로 전환
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // 유효토큰 값에서 user 데이터 가져와 보여주기 초기화
  const init = async () => {
    const data = (await axios.post("/verify")).data;
    setUser(data.user);
  };

  return (
    <div>
      <div>{user.id}님 환영합니다!</div>
      <div>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  );
};

export default Success;
