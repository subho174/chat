const { mongoose, Schema } = require("mongoose");

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: [true, "Enter some message"],
  },
  attachment: {
    type: String,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ members: 1 });
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
