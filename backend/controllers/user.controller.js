const User = require("../models/user.models");
const { ApiError } = require("../Utils/ApiError");
const { ApiResponse } = require("../Utils/ApiResponse");
const { asyncHandler } = require("../Utils/asyncHandler");
const { options } = require("../Utils/constants");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};
const signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username && email && password))
    return res.status(400).json(new ApiError(400, "All Fields are required"));

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist)
    return res.status(400).json(new ApiError(400, "User already exists"));

  const user = await User.create({
    username,
    email,
    password,
  });
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!newUser)
    return res.status(400).json(new ApiError(400, "Failed to register user"));

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { newUser, accessToken },
        "User registered successfully"
      )
    );
});

const logIn = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);

  if (!(username && email && password))
    return res.status(400).json(new ApiError(400, "All Fields are required"));

  const existingUser = await User.findOne({ email, username });
  // console.log(existingUser);

  if (!existingUser)
    return res.status(400).json(new ApiError(400, "User does not exist"));

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid)
    return res.status(400).json(new ApiError(400, "Password is wrong"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );
  // console.log(accessToken, refreshToken);

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken },
        "Logged in successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

module.exports = { signUp, logIn, logOut };
