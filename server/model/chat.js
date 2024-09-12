const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatSchema = new mongoose.Schema(
  {
    user1Id: {
      type: String,
      required: true,
    },
    user2Id: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  {
    fileUrl: String
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
