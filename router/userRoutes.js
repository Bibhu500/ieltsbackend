import express from "express";

import {
  authUser,
  registerUser,
  refreshToken,
  signoutUser
} from "../controllers/userController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyUser } from "../controllers/userController.js"

const router = express.Router();
router.post("/login", authUser);
router.post("/signup", registerUser);
// router.post("/signout", registerUser);
router.post("/refresh-token", refreshToken);
router.post('/signout', signoutUser);
router.post("/verifyuser", verifyUser);

export default router;