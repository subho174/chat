const Router = require("express");
const { verifyJWT } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  updateSocketId,
  storeMessage,
  checkIfOldChatExists,
  getChatHistory,
} = require("../controllers/chat.controller");

const chatRouter = Router();

chatRouter.get("/get-users", verifyJWT, getAllUsers);
chatRouter.patch("/update-socket-id", verifyJWT, updateSocketId);
chatRouter.post("/store-message", verifyJWT, storeMessage);
chatRouter.get("/old-chat", verifyJWT, checkIfOldChatExists);
chatRouter.get("/get-chatHistory", verifyJWT, getChatHistory);

module.exports = chatRouter;
