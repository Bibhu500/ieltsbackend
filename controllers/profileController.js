//controllers/profilecontroller.js

import asyncHandler from "express-async-handler";
import Speaking from "../models/speakingModel.js";
import { Writing } from "../models/writingModel.js";
import IELTSReadingResult from "../models/IELTSReadingResultModel.js";
import { ListeningSaved } from "../models/listeningModels.js"; // Add this import
import Profile from "../models/profileModel.js";


const fetchResults = asyncHandler(async (req, res, next) => {
  try {
    const uid = req.user.uid;
    console.log('Fetching results for user:', uid);

    const speaking_data = await Speaking.find({user_id: uid});
    const writing_data = await Writing.find({user_id: uid});
    const reading_data = await IELTSReadingResult.find({user_id: uid});
    const listening_data = await ListeningSaved.find({user_id: uid});

    console.log('Raw speaking data in json');

  

    if (speaking_data.length === 0 && writing_data.length === 0 && reading_data.length === 0 && listening_data.length === 0) {
      console.log('No data found for user:', uid);
      return res.json({ message: 'No test data available for this user' });
    }

    const data = {
      "speaking": {
        overallBand: speaking_data.map(d => d.result?.ieltsInfo?.overallBand || 0),
        time: speaking_data.map(d => d.createdAt),
        id: speaking_data.map(d => d._id)
      },
      "reading": {
        overallBand: reading_data.map(d => d.overallBand || 0),
        time: reading_data.map(d => d.createdAt),
        id: reading_data.map(d => d._id)
      },
      "writing": {
        overallBand: writing_data.map(d => d.result?.ieltsinfo?.overallBand || 0),
        time: writing_data.map(d => d.createdAt),
        id: writing_data.map(d => d._id)
      },
      "listening": {
        overallBand: listening_data.map(d => d.overallBand || 0),
        time: listening_data.map(d => d.createdAt),
        id: listening_data.map(d => d._id)
      },
    };

    res.json(data);
  } catch (e) {
    console.error('Error in fetchResults:', e);
    next(e);
  }
});
  const getProfile = async (req, res, next) => {
    try {
      // Log the entire req.user object for debugging
      
  
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      res.json({
        "name": req.user.fullName,
        "email": req.user.email,
        "role": req.user.role
      });
    } catch(err) {
      console.error('Error in getProfile:', err);
      next(err);
    }
  };

  export { fetchResults, getProfile};

