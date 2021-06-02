import React, { useState } from "react";

const Success = () => {
  const [user, setUser] = useState({});

  const logout = () => {
    router.push("/");
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
