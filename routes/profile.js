const express = require("express");
const router = express.Router();
const middleware = require("../middleware/middleware");

const Tweet = require("../models/Tweet");

// GET profile of logged in user
router.get("/", middleware.sessionAuth, (req, res) => {
  res.redirect(`/profile/${req.session.username}`);
});

// GET profile of provided user
router.get("/:username", middleware.checkUser, (req, res) => {
  Tweet.find({
    $or: [
      { username: req.user.username },
      { retweets: { $elemMatch: { username: req.user.username } } },
    ],
  })
    .then((tweets) => {
      // Custom sort function that prioritizes sorting retweet dates over the standard tweet date
      tweets.sort((a, b) => {
        const aRetweet = a.retweets.find(
          (obj) => obj.username === req.params.username
        );
        const bRetweet = b.retweets.find(
          (obj) => obj.username === req.params.username
        );

        if (aRetweet && bRetweet) {
          return bRetweet.date - aRetweet.date;
        } else if (aRetweet && !bRetweet) {
          return b.createdAt - aRetweet;
        } else if (!aRetweet && bRetweet) {
          return bRetweet - a.createdAt;
        } else {
          return b.createdAt - a.createdAt;
        }
      });

      return res.status(200).json({ username: req.user.username, tweets });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

module.exports = router;
