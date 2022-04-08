const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { UserAccount } = require("../models/UserAccount");
const path = require("path");
const fs = require("fs");

const pathToKey = path.join(__dirname, "../id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const verifyCallback = (jwt_payload, done) => {
  UserAccount.findById(jwt_payload.sub, (err, result) => {
    if (err) return done(err);
    if (result) return done(null, result);
    else return done(null, false);
  });
};

const Strategy = new JwtStrategy(options, verifyCallback);

module.exports = (passport) => {
  passport.use(Strategy);
};
