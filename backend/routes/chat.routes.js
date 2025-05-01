const Router = require("express");
const { verifyJWT } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  updateSocketId,
  storeMessage,
  checkIfOldChatExists,
  getChatHistory,
  setMessageAsViewed,
} = require("../controllers/chat.controller");
const upload = require("../middleware/multer.middleware");

const chatRouter = Router();

chatRouter.get("/get-users", verifyJWT, getAllUsers);
chatRouter.patch("/update-socket-id", verifyJWT, updateSocketId);
chatRouter.post(
  "/store-message",
  verifyJWT,
  upload.single("file"),
  storeMessage
);
chatRouter.get("/old-chat", verifyJWT, checkIfOldChatExists);
chatRouter.get("/get-chatHistory", verifyJWT, getChatHistory);
chatRouter.patch("/set-viewed", verifyJWT, setMessageAsViewed);

module.exports = chatRouter;
