const crypto = require("crypto");

function getCipherTextByPublicKey(publicKey, plainText) {
  return crypto
    .publicEncrypt(publicKey, Buffer.from(plainText, "utf8"))
    .toString("base64");
}

function getPlainTextByPrivateKey(privateKey, cipherText) {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(cipherText, "base64"))
    .toString("utf8");
}

function getCipherTextByPrivateKey(privateKey, plainText) {
  return crypto
    .privateEncrypt(privateKey, Buffer.from(plainText, "utf8"))
    .toString("base64");
}

function getPlainTextByPublicKey(publicKey, cipherText) {
  return crypto
    .publicDecrypt(publicKey, Buffer.from(cipherText, "base64"))
    .toString("utf8");
}
