import Listening from "../models/listeningModel.js";
import ListeningSaved from "../models/listeningSavedModel.js";
import asyncHandler from "express-async-handler";

const getListeningData = asyncHandler(async (req, res, next) => {
  const { type } = req.body;
  try {
      const lastTest = await ListeningSaved.aggregate([
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
      const count = await Listening.countDocuments();
      if(count == 0){
        return res.status(404).json({"message": "no available questions"});
      }else{
        const listening = await Listening.findOne({ "question_number": (prev_qno+1)%count });
        res.status(201).json(listening);
      }
  } catch (e) {
    next(e);
  }    
});


const saveResults = asyncHandler(async (req, res, next) => {
    const data = req.body;
    try {
        const listening = await ListeningSaved.create({
            user_id: req.user.uid,
            question_number: data.question_number,
            allQuestionsAndAnswers: data.allQuestionsAndAnswers,
            results: data.results
        });

        res.status(201).json({
            message: "saved",
            data: listening
          });
    } catch (e) {
      next(e);
    }
  });

 const getSavedListeningResults = asyncHandler(async (req, res, next) => {
    const { id } = req.body;
    try {
      const listeningResult = await ListeningSaved.findById(id);
      if (!listeningResult) {
        return res.status(404).json({ message: 'Listening result not found' });
      }
  
      res.status(200).json(listeningResult);
    } catch (e) {
      console.error('Error in getSavedListeningResults:', e);
      res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  });

export{saveResults, getListeningData, getSavedListeningResults};