import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      console.log('Verifying token:', token);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('Decoded token:', decoded);

      // Fetch the user from the database using the Firebase UID
      const user = await User.findOne({ firebaseId: decoded.uid });

      if (!user) {
        console.log('User not found in database');
        return res.status(404).json({ error: 'User not found' });
      }

      // Attach the full user object to the request
      req.user = user.toObject();
      req.user.uid = user.firebaseId;  // Ensure uid is set correctly
      console.log('User authenticated:', req.user.uid);
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Access token expired', needsRefresh: true });
      } else {
        return res.status(403).json({ error: 'Invalid token' });
      }
    }
  } else {
    console.log('No token provided');
    res.status(401).json({ error: 'No token provided' });
  }
};

export { verifyToken };