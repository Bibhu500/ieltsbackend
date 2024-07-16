import  {Writing} from "../models/writingModel.js";
import { WritingData } from "../models/writingDataModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const getWritingData = asyncHandler(async (req, res, next) => {
  const { type } = req.body;
  try {
      const lastTest = await Writing.aggregate([
        {
          $match: {
            user_id: req.user.uid, // Replace with the desired user_id
            type: type,          
        }
        },
        {
          $sort: {
            createdAt: -1 // Sort in descending order of createdAt
          }
        },
        {
          $limit: 1 // Get only the first document (the most recent one)
        }
      ])
      const prev_qno = lastTest[0]?lastTest[0].question_number:-1;
      const count = await WritingData.countDocuments({ "type": type });
      if(count == 0){
        return res.status(404).json({"message": "no available questions"});
      }else{
        const writing = await WritingData.findOne({ "question_number": (prev_qno+1)%count, "type": type });
        res.status(201).json(writing);
      }
  } catch (e) {
    next(e);
  }    
});

const saveResults = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
      console.log("Hello world");
      console.log(data);
      const { question, answer, result, imageUrl, type, wordCount, question_number } = data;
      const share_id = uuidv4();
      console.log(question_number);

      // Log the req.user object to see what's available
      console.log('req.user in saveResults:', req.user);

      // Check if req.user exists and has the necessary properties
      if (!req.user || !req.user.firebaseId) {
          return res.status(401).json({ message: "User not authenticated or missing firebaseId" });
      }

      const writing = await Writing.create({
          user_id: req.user.firebaseId, // Use firebaseId instead of _id
          question,
          answer,
          imageUrl,
          type,
          wordCount,
          result,
          share_id,
          question_number
      });

      console.log(writing);
      res.status(201).json({
          message: "saved",
          data: writing
      });
  } catch (e) {
      console.error('Error in saveResults:', e);
      next(e);
  }
});

const getSavedWritingResults = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  try {
    const writingResult = await Writing.findById(id);
    if (!writingResult) {
      return res.status(404).json({ message: 'Writing result not found' });
    }

    res.status(200).json(writingResult);
  } catch (e) {
    console.error('Error in getSavedWritingResults:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
});

  const getSharedResults = asyncHandler(async (req, res, next) => {
    const { shareId } = req.params;
    try {
        const writing = await Writing.findOne({
          share_id: shareId,
        });

        const authHeader = req.headers.authorization;  
        let isOwner = false;
        let isEditor = false;
        if(authHeader){
          const token = authHeader.split(' ')[1];
          console.log(token)
          if(token){
            try{
              const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
              console.log(decoded)
              if(decoded){
                const user_id = decoded.uid;
                console.log(user_id)
                if(user_id === writing.user_id){
                  isOwner = true;
                } 
        
                if(user_id && writing.editor_id && user_id === writing.editor_id){
                  isEditor = true;
                } 
              }
            } catch (err){
              console.log(err.stack)
            }
          }
          
        }
        
        let editor_name;
        if(writing.editor_id){
          const user = await User.findOne({firebaseId: writing.editor_id});
          editor_name = user.fullName
        }

        const writingObject = writing.toObject();
        writingObject.isEditor = isEditor;
        writingObject.isOwner = isOwner;
        writingObject.editor_name = editor_name;
        console.log(writingObject)
        res.status(200).json(writingObject);
    } catch (err) {
      next(err);
    }    
  });

  const addRemark = async (req, res, next) => {
    const { share_id, remarkText, remarkRemark } = req.body;
    try{
      const writingResult = await Writing.findOne({share_id});

      if(req.user.uid !== writingResult.editor_id){
        return res.status(401).json({message: "you are not an editor"})
      }

      const remark = {
        remarkText,
        remarkRemark
      }

      console.log(writingResult)

      writingResult.remarks.push(remark);
      writingResult.save();

      res.json(writingResult)

    } catch (err) {
      next(err);
    }
  }

export{saveResults, getSavedWritingResults, getSharedResults, getWritingData, addRemark};