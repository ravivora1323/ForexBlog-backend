const mongoose = require("mongoose");

module.exports = {
  connect: function () {
    mongoose
      .connect(process.env.DB_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(function (db) {
        console.log("Database connection established...");
      })
      .catch(function (error) {
        console.log("Database connection failed : " + error.message);
      });
  },
};
