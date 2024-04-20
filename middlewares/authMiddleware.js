import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;  
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Access token has expired
          console.log("Here");
          
          return res.status(401).json({ error: 'Access token expired', needsRefresh: true });
        } else {
          // Token is invalid
          console.log("Hello world")
          return res.status(403).json({ error: 'Invalid token' });
        }
      }
      
      req.user = user;
      console.log("Working...")
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

export { verifyToken };
