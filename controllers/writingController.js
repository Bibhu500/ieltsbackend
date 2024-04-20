import  {Writing} from "../models/writingModel.js";
import { WritingData } from "../models/writingDataModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';

const getWritingData = asyncHandler(async (req, res) => {
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
        res.status(404).json({"message": "no available questions"});
      }else{
        const writing = await WritingData.findOne({ "question_number": (prev_qno+1)%count, "type": type });
        res.status(201).json(writing);
      }
  } catch (e) {
    res.status(404);
    var errorMessage = e.message;
    throw new Error(errorMessage);
  }    
});

const saveResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
        console.log("Hello world")
        console.log(data);
        const { question, answer, result, imageUrl, type, wordCount, question_number } = data;
        const share_id = uuidv4();
        console.log(question_number)
        const writing = await Writing.create({
            user_id: req.user.uid,
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
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

  const getSavedResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const id = data.id;
    console.log(id)
    try {
        const writing = await Writing.findOne({
          _id: id,
          user_id: req.user.uid
        });
        res.status(201).json(writing);
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }    
  });

  const getSharedResults = asyncHandler(async (req, res) => {
    const { shareId } = req.params;
    try {
        const writing = await Writing.findOne({
          share_id: shareId,
        });
        res.status(201).json(writing);
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }    
  });

export{saveResults, getSavedResults, getSharedResults, getWritingData};