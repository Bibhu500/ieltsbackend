//contollers/userconstroller.js
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';

import auth from "../config/firebase=admin.js";
import Teacher from "../models/teacherModel.js";

const authUser = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  try {
    console.log('Received idToken:', idToken);
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Decoded token:', decodedToken);
    const uid = decodedToken.uid;

    let user = await User.findOne({ firebaseId: uid });
    console.log('Found user:', user);

    if (!user) {
      console.log('Creating new user');
      user = await User.create({
        fullName: decodedToken.name,
        email: decodedToken.email,
        firebaseId: uid,
        role: 'student'
      });
      console.log('New user created:', user);
    }

    const accessToken = jwt.sign({ uid: user.firebaseId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ uid: user.firebaseId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    console.log('Tokens generated');
    res.json({ accessToken, refreshToken });
  } catch (e) {
    console.error('Error in authUser:', e);
    next(e);
  }
});

  const registerUser = asyncHandler(async (req, res, next) => {
    try {
      const { fullName, email, firebaseId, role } = req.body;
      console.log('Received signup data:', { fullName, email, firebaseId, role });
  
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
      }
      
      const user = await User.create({
        fullName,
        email,
        firebaseId,
        role: role || 'student' // Provide a default value
      });
      console.log('User created in database:', user);
      
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    } catch (err) {
      console.error('Error in registerUser:', err);
      next(err);
    }
  });
  
  const refreshToken = asyncHandler(async (req, res, next) => {
    try{
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
    } catch ( err ){
      next(err);
    }
  });

  const signoutUser = asyncHandler(async (req, res, next) => {
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
      next(err);
    }
  });

  const verifyUser = asyncHandler(async (req, res, next) => {
    try{

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
    } catch (err) {
      next(err);
    }
  });

export{authUser, registerUser, refreshToken,signoutUser, verifyUser};