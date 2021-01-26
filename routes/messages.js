const express = require("express");
const router = express.Router();

const middleware = require("../middleware/middleware");

const Message = require("../models/Message");

// GET received messages from users that sent message to logged in user
// Sorted by most recent messages first
router.get("/", (req, res) => {
  Message.find(
    {
      usernameReceived: req.session.username,
    },
    "usernameSent message createdAt updatedAt"
  )
    .sort({ createdAt: -1 })
    .then((messages) => {
      return res.status(200).json({ messages });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
});

// GET all sent and received messages between given user
router.get("/:username", middleware.checkUser, (req, res) => {
  if (
    req.params.username.toLocaleLowerCase() ===
    req.session.username.toLocaleLowerCase()
  ) {
    return res.status(400).send("You cannot send messages to yourself.");
  }

  Message.find({
    $or: [
      {
        $and: [
          { usernameSent: req.session.username },
          { usernameReceived: req.user.username },
        ],
      },
      {
        $and: [
          { usernameSent: req.user.username },
          { usernameReceived: req.session.username },
        ],
      },
    ],
  }).then((messages) => {
    return res.status(200).json({ messages });
  });
});

// Send message to given username
router.post("/:username/send", middleware.checkUser, (req, res) => {
  if (
    req.params.username.toLocaleLowerCase() ===
    req.session.username.toLocaleLowerCase()
  ) {
    return res.status(400).send("You cannot send messages to yourself.");
  }

  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .send("You must supply a message in the request body.");
  }

  const messageData = new Message({
    usernameSent: req.session.username,
    usernameReceived: req.user.username,
    message,
  });

  messageData
    .save()
    .then(() => {
      // Successfully sent message
      return res.redirect(`/messages/${req.params.username}`);
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

// Edit message
router.patch("/edit/:id", middleware.checkMessage, (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .send("You must supply a message in the request body.");
  }

  req.message.message = message;
  req.message
    .save()
    .then(() => {
      return res.status(200).json(req.message);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

// Delete message
router.delete("/delete/:id", middleware.checkMessage, (req, res) => {
  req.message.remove((error, result) => {
    if (error) return res.status(500).json(error);

    return res.status(200).json({ result });
  });
});

module.exports = router;
