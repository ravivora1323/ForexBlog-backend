const emailRegx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const { UserAccount } = require("../models/UserAccount");

module.exports.registerValidate = (req, res, next) => {
  const errors = {
    username: [],
    email: [],
    password: [],
    general: [],
  };
  if (typeof req.body.username === "undefined" || req.body.username === "") {
    errors.username.push("Username is required.");
  }
  if (typeof req.body.email === "undefined" || req.body.email === "") {
    errors.email.push("Email is required.");
  } else if (!emailRegx.test(req.body.email)) {
    errors.email.push("Email address is invalid.");
  }
  if (typeof req.body.password === "undefined" || req.body.password === "") {
    errors.password.push("Password is required.");
  } else if (req.body.password.trim().length < 4) {
    errors.password.push("Password should be more than 4 character.");
  } else if (req.body.password.trim().length > 16) {
    errors.password.push("Password should be less than 16 character.");
  }
  if (
    errors.username.length === 0 &&
    errors.email.length === 0 &&
    errors.password.length === 0 &&
    errors.general.length === 0
  ) {
    // checking username or email is already exist or not.
    UserAccount.findOne(
      { $or: [{ username: req.body.username }, { email: req.body.email }] },
      function (err, user) {
        if (err) {
          errors.general.push(err.message);
        }
        if (user !== null) {
          if (user.username == req.body.username) {
            errors.username.push("username is already in use.");
          }
          if (user.email == req.body.email) {
            errors.email.push("Email is already in use.");
          }
        }
        if (
          errors.username.length > 0 ||
          errors.email.length > 0 ||
          errors.password.length > 0 ||
          errors.general.length > 0
        ) {
          return res.status(403).json({
            success: false,
            errors,
          });
        } else {
          next();
        }
      }
    );
  }
};
