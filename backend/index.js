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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("new user connected", socket.id);
  socket.on('chat', ({message, socketId }) => {
    socket.to(socketId).emit("chat", message);
  })
  socket.emit("chat", socket.id);
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
