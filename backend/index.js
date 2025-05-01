let express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const userRouter = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const { ApiError } = require("./Utils/ApiError");
require("dotenv").config();
const cors = require("cors");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("./models/user.models");
const chatRouter = require("./routes/chat.routes");
const { userInfo } = require("os");
// console.log(process.env.CORS_ORIGIN);
const userSocketMap = {};

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/chat", chatRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("new user connected", socket.id);
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;
  // console.log(userId, userSocketMap);
  console.log(userSocketMap);
  // socket.on("chat", ({ message, socketId }) => {
  //   socket.to(socketId).emit("chat", message);
  // });
  socket.on("chat", ({ messageId, message, receiver, isViewed }) => {
    console.log(userId);
    const receiverId = userSocketMap[receiver];
    console.log(receiverId);
    if (receiverId) socket.to(receiverId).emit("chat", {messageId,message, isViewed});
    else console.log(`${receiver} not connected now`);
    // console.log(userId, receiverId, userSocketMap);
  });
  socket.on("message-viewed", ({receiver}) => {
    const receiverId = userSocketMap[receiver];
    console.log(receiverId);
    if (receiverId) socket.to(receiverId).emit("message-viewed");
    else console.log(`${userId} not connected now`);
  })
  // socket.emit("save-id", socket.id);
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      // console.log(`${userId} disconnected`.userSocketMap);
      // console.log(userSocketMap);
    }
  });
});

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;

//     if (!token) return next(new ApiError(401, "Authentication Error"));
//     next();
//   });
// });
io.use(async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie);
    if (!cookies) return next(new Error("No Cookie found"));

    const token = cookies?.accessToken;
    if (!token) return next(new Error("Access Token not found in cookies"));

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) return next(new Error("User not found"));

    socket.user = user;
    // console.log(socket.user);
    next();
  } catch (err) {
    console.error(err.message);
    next(new Error("Authentication error"));
  }
});

connectDB();

server.listen(4002, () => {
  console.log("Server is ready");
});
let connectedUsers = { userSocketMap: userSocketMap };

module.exports = { connectedUsers };
