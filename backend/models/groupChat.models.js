const { mongoose, Schema } = require("mongoose");

const groupChatSchema = new Schema(
  {
    groupName: {
      type: String,
      required: [true, "Group Name is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const groupChat = mongoose.model("groupChat", groupChatSchema);

module.exports = groupChat;
