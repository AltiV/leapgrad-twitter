const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

router.post("/", (req, res) => {
  let { username, password } = req.body;

  User.findOne({ username: new RegExp(`^${username}$`, "i") })
    .then((user) => {
      if (!user) {
        // For security purposes, do not reveal in login that a user does not
        // exist in the database
        return res.status(404).json({
          errors: "Invalid credentials",
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ errors: "Invalid credentials" });
            }

            // Login successful
            req.session.loggedin = true;
            req.session.username = user.username;
            res.redirect("/");
          })
          .catch((err) => {
            res.status(500).json({ errors: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
    });
});

module.exports = router;
