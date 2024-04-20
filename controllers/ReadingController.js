import Reading from "../models/ReadingModel.js";
import ReadingSaved from "../models/readingSavedModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';

const getTestSet = asyncHandler(async (req, res) => {
    try {
        const reading = await Reading.aggregate([{ $sample: { size: 3 } }])
        res.status(200).json({
            data: reading
          });
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
});


const saveResults = asyncHandler(async (req, res) => {
    const data = req.body;
    try {
        const share_id = uuidv4();
        const reading = await ReadingSaved.create({
            user_id: req.user.uid,
            passages: data.passages,
            results: data.results,
            share_id,
        });

        res.status(201).json({
            message: "saved",
            data: reading
          });
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

export{saveResults, getTestSet};