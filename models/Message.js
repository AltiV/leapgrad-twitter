const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    usernameSent: {
      type: String,
      required: true,
    },
    usernameReceived: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

module.exports = mongoose.model("Message", messageSchema);
