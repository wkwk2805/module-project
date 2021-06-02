import React from "react";

const Register = () => {
  const _onSubmit = async (e) => {
    e.preventDefault();
    const param = {};
    for (let item of e.target) {
      item.name && (param[item.name] = item.value);
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
