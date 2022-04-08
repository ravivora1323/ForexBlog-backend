const Router = require("express").Router();
const { registerValidate } = require("../middlewares/Auth");
const { UserAccount } = require("../models/UserAccount");
const { genPassword, issueJWT } = require("../helpers/utils");

Router.post("/", registerValidate, (req, res) => {
  UserAccount.create({
    username: req.body.username,
    email: req.body.email,
    hash: genPassword(req.body.password).hash,
    salt: genPassword(req.body.password).salt,
  })
    .then(function (user) {
      const jwt = issueJWT(user._id);
      return res.status(201).json({
        success: true,
        message: "registered successfully.",
        data: {
          username: user.username,
          email: user.email,
        },
        token: jwt.token,
        expire: jwt.expires,
      });
    })
    .catch(function (error) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    });
});

module.exports = Router;
