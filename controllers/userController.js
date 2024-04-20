import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';

import admin from "firebase-admin";
import auth from "../config/firebase=admin.js";

const authUser = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    try {
      
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;  
      const accessToken = jwt.sign({ uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
      const refreshToken = jwt.sign({ uid }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      console.log("Access Token" + accessToken);
      console.log("Refresh Token" + refreshToken);
      res.json({ accessToken, refreshToken });

    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

  const registerUser = asyncHandler(async (req, res) => {
    console.log("Hello world");
    const { fullName, email, firebaseId } = req.body;
  
    console.log(fullName, email, firebaseId);
  
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      res.status(400);
      throw new Error("User already exists.");
    }
  
    const user = await User.create({
      fullName,
      email,
      firebaseId
    });
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        firebaseId: user.firebaseId
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  
  const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid refresh token' });
        }
        const accessToken = jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
      });
    } else {
      res.status(401).json({ error: 'No refresh token provided' });
    }
  });

  const signoutUser = asyncHandler(async (req, res) => {
    try {
      // 1. Verify the access token
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      const token = authorization.split(' ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;
  
      // 2. Revoke the user's Firebase session
      await auth.revokeRefreshTokens(uid);
  
      res.json({ message: 'User signed out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to sign out user' });
    }
  });

  const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid access token', "valid": false });
        }
        res.json({"valid": true});
      });
    } else {
      res.status(401).json({ error: 'No access token provided'});
    }
  });

export{authUser, registerUser, refreshToken,signoutUser, verifyUser};