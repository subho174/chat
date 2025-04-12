const Router = require("express");
const { signUp, logIn, logOut } = require("../controllers/user.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const userRouter = Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/log-in", logIn);
userRouter.patch("/log-out", verifyJWT, logOut);

module.exports = userRouter;
