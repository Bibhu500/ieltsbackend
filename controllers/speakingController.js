import Speaking from "../models/speakingModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const saveResults = asyncHandler(async (req, res, next) => {
    const { data } = req.body;
    try {
        const share_id = uuidv4();
        console.log(share_id);
        console.log("Hello world")
        const speaking = await Speaking.create({
            user_id: req.user.uid,
            allQuestionsAndAnswers: data.allQuestionsAndAnswers,
            result: data.result,
            share_id,
        });
        console.log(speaking);
        res.status(201).json({
            message: "saved",
            data: speaking
          });
    } catch (e) {
      next(e);
    }
  });

  const getSavedSpeakingResults = asyncHandler(async (req, res, next) => {
    const { data } = req.body;
    try {
      const speakingResult = await Speaking.findById(data.id);
      if (!speakingResult) {
        return res.status(404).json({ message: 'Speaking result not found' });
      }
  
      res.status(200).json(speakingResult);
    } catch (e) {
      console.error('Error in getSavedSpeakingResults:', e);
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

      console.log(speaking)

      speaking.remarks = remarks; 
      speaking.save();
      res.json(speaking)

    } catch (err) {
      next(err);
    }
  }


export{saveResults, getSavedSpeakingResults, getSharedResults, addRemark};