const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

router.post("/", (req, res) => {
  let { username, password } = req.body;

  // First check to make sure all fields are valid
  let errors = [];

  if (!username) {
    errors.push("Username required");
  }

  if (!password) {
    errors.push("Password required");
  } else if (password.length < 6) {
    errors.push("Password requires a minimum of six characters");
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  // If all fields are valid, check database to see if username is available
  User.findOne({ username: new RegExp(`^${username}$`, "i") })
    .then((user) => {
      if (user) {
        return res.status(422).json({ errors: "Username already in use" });
      } else {
        // Everything valid; create account
        const user = new User({
          username,
          password,
        });

        bcrypt.hash(password, 10).then((hash) => {
          // Replace plaintext password with hashed version
          user.password = hash;

          user
            .save()
            .then(() => {
              // Successfully created user; run the same logic as login
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect("/");
            })
            .catch((err) => {
              res.status(500).json({
                errors: err,
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: err,
      });
    });
});

module.exports = router;
