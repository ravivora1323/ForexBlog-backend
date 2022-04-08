require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const app = express();

// passport configuration
require("./config/passport")(passport);

// global middleware
app.use(cors());
app.use(express.json());

// configure all routes
app.use("/user", require("./routes/AuthRoute"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Forex blogs.",
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port :: ${process.env.SERVER_PORT}`);
});
