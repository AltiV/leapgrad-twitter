require("./database/db");

const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const sessionAuth = require("./middleware/middleware");
const axios = require("axios");

// Initialize express application
const app = express();

app.use(express.json());

app.use(
  session({
    // TODO: Replace this with env variable after
    secret: "something",
    resave: true,
    saveUninitialized: true,
  })
);

// Set up port
const PORT = process.env.PORT || 3000;

// Allow usage of environment variables
dotenv.config();

// Set up routes
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const profileRouter = require("./routes/profile");
const messagesRouter = require("./routes/messages");

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/profile", profileRouter);
app.use("/messages", sessionAuth.sessionAuth, messagesRouter);

app.get("/", (req, res) => {
  let returnString = `Welcome to the LeapGrad Twitter API.\n\n`;

  if (req.session.loggedin && req.session.username) {
    returnString += `You are currently logged in as ${req.session.username}.`;
  } else {
    returnString += `You are currently not logged in.`;
  }

  res.send(returnString);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  // axios
  //   .post("http://localhost:3000/login", {
  //     username: "username",
  //     password: "password",
  //   })
  //   .then((response) => {
  //     console.log(response.data);
  //   })
  //   .catch((err) => console.log(err));
});

module.exports = app; // for testing
