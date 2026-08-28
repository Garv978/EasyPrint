const express = require("express");

const {
  googleUserAuth,
  googleOwnerAuth,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/user/auth/google", googleUserAuth);

authRouter.post("/owner/auth/google", googleOwnerAuth);

authRouter.get("/auth/me", getCurrentUser);

authRouter.post("/auth/logout", logout);

module.exports = authRouter;