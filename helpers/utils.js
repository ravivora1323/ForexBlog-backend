const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const pathToKey = path.join(__dirname, "../id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf-8");

module.exports.genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: hash,
  };
};

module.exports.comparePassword = (password, hash, salt) => {
  const newHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
};

module.exports.issueJWT = (id) => {
  const expiresIn = "1d";
  const payload = {
    sub: id,
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };
  const jwt = jsonwebtoken.sign(payload, PRIV_KEY, { algorithm: "RS256" });
  return {
    token: "Bearer " + jwt,
    expires: expiresIn,
  };
};
