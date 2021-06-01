const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const port = 3000;
const handle = app.getRequestHandler();
const fs = require("fs");
const uploadDir = "uploads";
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir + "/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploader = multer({ storage });

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    server.post("/upload_array", uploader.array("files"), (req, res) => {
      console.log("upload_array", req.files);
      res.json({ ok: true });
    });

    server.post("/upload_single", uploader.single("file"), (req, res) => {
      console.log("upload_single", req.files);
      res.json({ ok: true });
    });

    server.post("/remove_file", (req, res) => {
      fs.unlinkSync(uploadDir + "/" + req.body.fileName);
      const files = fs.readdirSync(uploadDir);
      res.json(files);
    });

    server.get("/files", (req, res) => {
      const files = fs.readdirSync(uploadDir);
      res.json(files);
    });

    server.get("/download", (req, res) => {
      res.download(uploadDir + "/" + req.query.fileName);
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
