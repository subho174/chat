const { default: mongoose, Types } = require("mongoose");
const Chat = require("../models/chat.models");
const User = require("../models/user.models");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
const { asyncHandler } = require("../Utils/asyncHandler");

const updateSocketId = asyncHandler(async (req, res) => {
  const { userSocketId } = req.body;
  console.log(userSocketId, req.user._id);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { userSocketId },
    },
    { new: true }
  );

  if (!user)
    return res
      .status(400)
      .json(new ApiError(400, "Failed to update socket id"));

  return res
    .status(200)
    .json(new ApiResponse(200, user, "socket id updated successfully"));
});

const getChatHistory = asyncHandler(async (req, res) => {
  // const chats = await Chat.find({members: req.user._id}).select("members messages -_id");

  // if (!chats)
  //   return res.status(404).json(new ApiError(404, "Chat history not found"));

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, chats, "Chat history fetched successfully"));

  const chats = await Chat.aggregate([
    {
      $match: {
        members: req.user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
        pipeline: [
          {
            $project: {
              username: 1,
              userSocketId: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);

  if (!chats)
    return res.status(404).json(new ApiError(404, "Chat history not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chat history fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");
  if (!users) return res.status(404).json(new ApiError(404, "users not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const storeMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;
  console.log(req.user._id, receiverId);

  if (!(message && receiverId))
    return res.status(400).json(new ApiError(400, "Enter a message"));

  const oldChat = await Chat.findOne({
    members: { $all: [req.user._id, receiverId] },
  });

  // one case is pending here; if somehow fetching oldChat from db failed, then what to do;

  // if (!oldChat)
  //   return res.status(400).json(new ApiError(400, "Failed to send message"));

  if (oldChat && oldChat.messages.length != 0) {
    const updatedChat = await Chat.findByIdAndUpdate(
      oldChat._id,
      {
        $push: { messages: { ...message, senderId: req.user._id, receiverId } },
      },
      { new: true }
    );

    if (!updatedChat)
      return res.status(400).json(new ApiError(400, "Failed to send message"));

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Message stored successfully"));
  }
  const newMessage = await Chat.create({
    // senderId: req.user._id,
    // receiverId,
    members: [req.user._id, receiverId],
    messages: [{ ...message, senderId: req.user._id, receiverId }],
  });

  if (!newMessage)
    return res.status(400).json(new ApiError(400, "Failed to start new chat"));

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message stored successfully"));
});

const checkIfOldChatExists = asyncHandler(async (req, res) => {
  const { receiverId } = req.query;
  console.log(req.user._id, receiverId);

  if (!receiverId)
    return res.status(400).json(new ApiError(400, "Enter receiver id"));

  const oldChat = await Chat.findOne({
    members: { $all: [req.user._id, receiverId] },
  });

  if (oldChat)
    return res
      .status(200)
      .json(new ApiResponse(200, oldChat, "Old Chat found"));

  return res.status(404).json(new ApiError(404, {}, "No Chat found"));
});
module.exports = {
  getAllUsers,
  updateSocketId,
  getChatHistory,
  storeMessage,
  checkIfOldChatExists,
};
