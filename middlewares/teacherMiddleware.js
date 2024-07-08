import jwt from "jsonwebtoken";
import Teacher from "../models/teacherModel.js";

const verifyTeacher = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;  
  
        if (authHeader) {
            const token = authHeader.split(' ')[1];          
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(user.uid)
            const teacher = await Teacher.findOne({ firebaseId: user.uid });
            if(!teacher){
                return res.status(401).json({"message": "User Id is not valid"})
            }
            req.user = user;
            next();
        } else {
          res.status(401).json({ error: 'No token provided' });
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {          
            return res.status(401).json({ error: 'Access token expired', needsRefresh: true });
        } else {
            console.log(err);
            return res.status(403).json({ error: 'Invalid token' });
        }
    }
};

export { verifyTeacher };
