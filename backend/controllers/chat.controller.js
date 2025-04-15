const { default: mongoose, Types } = require("mongoose");
const Chat = require("../models/chat.models");
const User = require("../models/user.models");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
const { asyncHandler } = require("../Utils/asyncHandler");

const updateSocketId = asyncHandler(async (req, res) => {
  const { userSocketId } = req.body;
console.log(userSocketId,req.user._id);

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

  // const ifPastFriends = await Chat.findOne({});
  const newMessage = await Chat.create({
    // senderId: req.user._id,
    // receiverId,
    members: [req.user._id, receiverId],
    messages: [{ ...message, senderId: req.user._id, receiverId }],
  });

  if (!newMessage)
    return res.status(400).json(new ApiError(400, "Failed to store message"));

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message stored successfully"));
});
module.exports = { getAllUsers, updateSocketId, storeMessage };
