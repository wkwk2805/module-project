const axios = require("axios");

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    config.headers.Authorization = token;
    return config;
  },
  (err) => {
    return err;
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.message.includes("401")) {
      alert("세션이 만료되었습니다. 다시 로그인 해주세요");
      location.href = "/";
    }
    return error;
  }
);

module.exports = instance;
