const mongoose = require("mongoose");

const User = require("../models/User");
const Message = require("../models/Message");
const Tweet = require("../models/Tweet");

const sessionAuth = (req, res, next) => {
  if (!req.session.loggedin) {
    res.status(401).send("You must be logged in to access this route.");
  } else {
    next();
  }
};

const checkUser = (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username: new RegExp(`^${username}$`, "i") })
    .then((user) => {
      if (!user) {
        res.status(400).send("No profile found for this user.");
      } else {
        req.user = user;
        next();
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const checkMessage = (req, res, next) => {
  const { id } = req.params;

  Message.findById(id)
    .then((message) => {
      if (!message) {
        res.status(400).send("This message does not exist.");
      } else if (message.usernameSent !== req.session.username) {
        res.status(400).send("You cannot modify someone else's message.");
      } else {
        req.message = message;
        next();
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const checkTweet = (req, res, next) => {
  const { id } = req.params;

  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) {
        res.status(400).send("This tweet does not exist.");
      } else {
        req.tweet = tweet;
        next();
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

module.exports = { sessionAuth, checkUser, checkMessage, checkTweet };
