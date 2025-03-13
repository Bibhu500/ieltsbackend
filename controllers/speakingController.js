import Speaking from "../models/speakingModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const getSavedSpeakingResults = asyncHandler(async (req, res, next) => {
  try {
    const speakingResults = await Speaking.find({ user_id: req.user.uid });
    if (speakingResults.length === 0) {
      return res.status(404).json({ message: 'No speaking results found for this user' });
    }
    
    res.status(200).json(speakingResults);
  } catch (e) {
    console.error('Error in getSavedSpeakingResults:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
});


const getSavedSpeakingResult = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    const speakingResult = await Speaking.findById(id);
    
    if (!speakingResult) {
      return res.status(404).json({ message: 'Speaking result not found' });
    }
    
    res.status(200).json(speakingResult);
  } catch (e) {
    console.error('Error in getSavedSpeakingResult:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
});

const saveResults = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
    // Get user information
    const user = await User.findOne({ firebaseId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is a student and has exceeded the free test limit
    if (user.role === 'student') {
      const testCount = await Speaking.countDocuments({ user_id: req.user.uid });
      if (testCount >= 2) {
        return res.status(403).json({ message: "Free test limit exceeded. Please upgrade to premium." });
      }
    }

    const share_id = uuidv4();
    
    // Check if data.result exists and has the expected structure
    if (!data.result || typeof data.result.overallBand === 'undefined') {
      return res.status(400).json({ message: "Invalid result data structure" });
    }

    const speaking = await Speaking.create({
      user_id: req.user.uid,
      allQuestionsAndAnswers: data.allQuestionsAndAnswers,
      result: data.result,
      overallBand: data.result.overallBand,
      share_id,
    });

    res.status(201).json({ message: "saved", data: speaking });
  } catch (e) {
    console.error('Error in saveResults:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
});


  const getSharedResults = asyncHandler(async (req, res, next) => {
    const { shareId } = req.params;
    try {
        const speaking = await Speaking.findOne({
          share_id: shareId,
        });

        const authHeader = req.headers.authorization;  
        let isOwner = false;
        let isEditor = false;
        if(authHeader){
          const token = authHeader.split(' ')[1];
          if(token){
            try{
              const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
              if(decoded){
                const user_id = decoded.uid;
                if(user_id === speaking.user_id){
                  isOwner = true;
                } 
        
                if(user_id && speaking.editor_id && user_id === speaking.editor_id){
                  isEditor = true;
                } 
              }
            } catch (err){
              console.log(err.stack)
            }
          }
          
        }
        
        let editor_name;
        if(speaking.editor_id){
          const user = await User.findOne({firebaseId: speaking.editor_id});
          editor_name = user.fullName
        }

        const speakingObject = speaking.toObject();
        speakingObject.isEditor = isEditor;
        speakingObject.isOwner = isOwner;
        speakingObject.editor_name = editor_name;
        res.status(200).json(speakingObject);
    } catch (err) {
      next(err);
    }    
  });

  const addRemark = async (req, res, next) => {
    const { share_id, remarks } = req.body;
    try{
      const speaking = await Speaking.findOne({share_id});

      if(req.user.uid !== speaking.editor_id){
        return res.status(401).json({message: "you are not an editor"})
      }

      console.log(" your speaking data are coming to the profile")

      speaking.remarks = remarks; 
      speaking.save();
      res.json(speaking)

    } catch (err) {
      next(err);
    }
  }


  export { saveResults, getSavedSpeakingResults, getSharedResults, addRemark, getSavedSpeakingResult };
