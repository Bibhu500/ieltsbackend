//userRoutes.js 
import express from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";

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
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ firebaseId: decoded.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accessToken = jwt.sign({ uid: user.firebaseId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});
router.post('/signout', signoutUser);
router.post("/verifyuser", verifyUser);

export default router;