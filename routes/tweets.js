const express = require("express");
const router = express.Router();

const middleware = require("../middleware/middleware");

const Tweet = require("../models/Tweet");

// GET tweets made by logged in user, sorted by most recent tweets first
router.get("/", middleware.sessionAuth, (req, res) => {
  Tweet.find({
    username: req.session.username,
  })
    .sort({ createdAt: -1 })
    .then((tweets) => {
      return res.status(200).json({ tweets });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});

// GET specific tweet
router.get("/:id", middleware.checkTweet, (req, res) => {
  return res.status(200).json({ tweet: req.tweet });
});

// GET all tweets made by provided user
router.get("/user/:username", middleware.checkUser, (req, res) => {
  Tweet.find({
    username: req.user.username,
  })
    .sort({ createdAt: -1 })
    .then((tweets) => {
      return res.status(200).json({ tweets });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});

// Create a tweet
router.post("/create", middleware.sessionAuth, (req, res) => {
  const { tweet } = req.body;

  if (!tweet) {
    return res.status(400).send("You must supply a tweet in the request body.");
  }

  const tweetData = new Tweet({
    username: req.session.username,
    tweet,
    retweets: [],
    likes: [],
  });

  tweetData
    .save()
    .then(() => {
      // Successfully sent message
      return res.redirect(`/tweets`);
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

// Edit tweet
router.patch(
  "/edit/:id",
  middleware.sessionAuth,
  middleware.checkTweet,
  (req, res) => {
    const { tweet } = req.body;

    if (req.tweet.username !== req.session.username) {
      return res.status(400).send("You cannot edit someone else's tweet.");
    }

    if (!tweet) {
      return res
        .status(400)
        .send("You must supply a tweet in the request body.");
    }

    req.tweet.tweet = tweet;
    req.tweet
      .save()
      .then(() => {
        return res.status(200).json(req.tweet);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
);

// Delete tweet
router.delete(
  "/delete/:id",
  middleware.sessionAuth,
  middleware.checkTweet,
  (req, res) => {
    if (req.tweet.username !== req.session.username) {
      return res.status(400).send("You cannot delete someone else's tweet.");
    }

    req.tweet.remove((error, result) => {
      if (error) return res.status(500).json(error);

      return res.status(200).json({ result });
    });
  }
);

// Like/unlike tweet
router.patch(
  "/like/:id",
  middleware.sessionAuth,
  middleware.checkTweet,
  (req, res) => {
    if (!req.tweet.likes.includes(req.session.username)) {
      req.tweet.likes.push(req.session.username);
    } else {
      req.tweet.likes.splice(req.tweet.likes.indexOf(req.session.username), 1);
    }

    req.tweet
      .save()
      .then(() => {
        return res.status(200).json(req.tweet);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
);

// Retweet/un-retweet
router.patch(
  "/retweet/:id",
  middleware.sessionAuth,
  middleware.checkTweet,
  (req, res) => {
    if (!req.tweet.retweets.some((e) => e.username === req.session.username)) {
      req.tweet.retweets.push({
        username: req.session.username,
        date: Date.now(),
      });
    } else {
      req.tweet.retweets = req.tweet.retweets.filter(
        (obj) => obj.username !== req.session.username
      );
    }

    req.tweet
      .save()
      .then(() => {
        return res.status(200).json(req.tweet);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
);

module.exports = router;
