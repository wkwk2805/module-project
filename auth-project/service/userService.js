const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const secretKey = require("../config/secretkey").secretKey;
const options = require("../config/secretkey").options;

const users = require("../service/users");

const userService = {
  register: async (param) => {}, // 데이터베이스 연동하여 유저 등록
  remove: async (param) => {}, // 데이터베이스 연동하여 유저 삭제
  update: async (param) => {}, // 데이터베이스 연동하여 유저 수정
  findUser: async (id, password) => {
    return users.filter((e) => id == e.id && password == e.password)[0];
  }, // 데이터베이스 연동하여 유저 찾기
  sign: (payload) => {
    return {
      token: jwt.sign(payload, secretKey, options),
      refreshToken: randToken.uid(256),
    };
  },
  verify: (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        return false;
      } else if (err.message === "invalid token") {
        return false;
      } else {
        return false;
      }
    }
  },
};

module.exports = userService;
