require("./database/db");

const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const sessionAuth = require("./middleware/middleware");

// Initialize express application
const app = express();

app.use(express.json());

// Set up session to store user data while logged in
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
const tweetsRouter = require("./routes/tweets");

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/profile", profileRouter);
// Messages are only avaliable if logged in
app.use("/messages", sessionAuth.sessionAuth, messagesRouter);
app.use("/tweets", tweetsRouter);

app.get("/", (req, res) => {
  let returnString = `Welcome to the Twitter Clone API.\n\n`;

  if (req.session.loggedin && req.session.username) {
    returnString += `You are currently logged in as ${req.session.username}.`;
  } else {
    returnString += `You are currently not logged in.`;
  }

  return res.send(returnString);
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

module.exports = app; // for testing
