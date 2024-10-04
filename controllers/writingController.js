import { Writing } from "../models/writingModel.js";
import { WritingData } from "../models/writingDataModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const getWritingData = asyncHandler(async (req, res, next) => {
  console.log('getWritingData called');
  console.log('Request body:', req.body);
  console.log('User:', req.user);
  const { type } = req.body;
  try {
    console.log('Received request for writing type:', type);

    const lastTest = await Writing.aggregate([
      {
        $match: {
          user_id: req.user.uid,
          type: type,          
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $limit: 1
      }
    ]);

    const prev_qno = lastTest[0] ? lastTest[0].question_number : -1;
    const count = await WritingData.countDocuments({ "type": type });
    
    console.log('Previous question number:', prev_qno);
    console.log('Total questions of this type:', count);

    if (count == 0) {
      return res.status(404).json({ "message": "No available questions for this type" });
    } else {
      const writing = await WritingData.findOne({ 
        "question_number": (prev_qno + 1) % count, 
        "type": type 
      });

      if (!writing) {
        return res.status(404).json({ "message": "No question found for this type" });
      }

      console.log('Found question:', writing);
      res.status(200).json(writing);
    }
  } catch (e) {
    console.error('Error in getWritingData:', e);
    next(e);
  }    
});

const saveResults = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
    console.log("Saving writing results. Received data:", data);
    const { question, answer, result, imageUrl, type, wordCount, question_number } = data;
    const share_id = uuidv4();

    if (!req.user || !req.user.firebaseId) {
      return res.status(401).json({ message: "User not authenticated or missing firebaseId" });
    }

    console.log("Creating writing entry with:", {
      user_id: req.user.firebaseId,
      question,
      answer,
      imageUrl,
      type,
      wordCount,
      result,
      share_id,
      question_number
    });

    const writing = await Writing.create({
      user_id: req.user.firebaseId,
      question,
      answer,
      imageUrl,
      type,
      wordCount,
      result,
      share_id,
      question_number
    });

    console.log("Saved writing result:", writing);
    res.status(201).json({
      message: "saved",
      data: writing
    });
  } catch (e) {
    console.error('Error in saveResults:', e);
    res.status(500).json({ message: "Error saving results", error: e.message });
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

    if (!writing) {
      return res.status(404).json({ message: 'Shared writing result not found' });
    }

    const authHeader = req.headers.authorization;  
    let isOwner = false;
    let isEditor = false;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log('Token:', token);
      if (token) {
        try {
          const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          console.log('Decoded token:', decoded);
          if (decoded) {
            const user_id = decoded.uid;
            console.log('User ID:', user_id);
            if (user_id === writing.user_id) {
              isOwner = true;
            } 
    
            if (user_id && writing.editor_id && user_id === writing.editor_id) {
              isEditor = true;
            } 
          }
        } catch (err) {
          console.error('Error verifying token:', err.stack);
        }
      }
    }
    
    let editor_name;
    if (writing.editor_id) {
      const user = await User.findOne({firebaseId: writing.editor_id});
      editor_name = user ? user.fullName : 'Unknown';
    }

    const writingObject = writing.toObject();
    writingObject.isEditor = isEditor;
    writingObject.isOwner = isOwner;
    writingObject.editor_name = editor_name;
    console.log('Returning writing object:', writingObject);
    res.status(200).json(writingObject);
  } catch (err) {
    console.error('Error in getSharedResults:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }    
});

const addRemark = asyncHandler(async (req, res, next) => {
  const { share_id, remarkText, remarkRemark } = req.body;
  try {
    const writingResult = await Writing.findOne({share_id});

    if (!writingResult) {
      return res.status(404).json({message: "Writing result not found"});
    }

    if (req.user.uid !== writingResult.editor_id) {
      return res.status(401).json({message: "You are not authorized to add remarks"});
    }

    const remark = {
      remarkText,
      remarkRemark
    };

    console.log('Adding remark:', remark);

    writingResult.remarks.push(remark);
    await writingResult.save();

    res.json(writingResult);
  } catch (err) {
    console.error('Error in addRemark:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export { saveResults, getSavedWritingResults, getSharedResults, getWritingData, addRemark };