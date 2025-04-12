const mongoose = require("mongoose");
const { asyncHandler } = require("../Utils/asyncHandler");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
