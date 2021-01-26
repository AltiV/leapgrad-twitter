const express = require("express");
const router = express.Router();
const middleware = require("../middleware/middleware");

const User = require("../models/User");

router.get("/", middleware.sessionAuth, (req, res) => {
  res.status(200).json({
    username: req.session.username,
  });
});

router.get("/:username", middleware.checkUser, (req, res) => {
  res.status(200).json({
    username: req.user.username,
  });
});

module.exports = router;
