const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const port = 3000;
const handle = app.getRequestHandler();
const userService = require("../service/userService");

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    // 로그인
    server.post("/login", async (req, res) => {
      const { id, password } = req.body;
      const user = await userService.findUser(id, password);
      res.json(
        user
          ? { ok: true, token: userService.sign({ id }).token, user }
          : { ok: false }
      );
    });

    // 회원가입
    server.post("/register", async (req, res) => {
      const { id, password } = req.body;
      await userService.register(id, password);
      res.json({
        ok: true,
        token: userService.sign({ id }).token,
        user: { id },
      });
    });

    // user token 검증
    server.post("/verify", (req, res) => {
      res.json({
        ok: true,
        user: userService.verify(req.headers.authorization),
      });
    });

    // 로그인 유지
    server.use((req, res, next) => {
      const token = req.headers.authorization;
      if (!userService.verify(token)) res.status(401); // 토큰 검증
      next();
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Connected ${port}port!`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
