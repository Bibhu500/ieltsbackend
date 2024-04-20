import Speaking from "../models/speakingModel.js";
import asyncHandler from "express-async-handler";

const saveResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
        console.log(data);
        console.log(req.user);
        console.log(req.headers);
        const speaking = await Speaking.create({
            user_id: req.user.uid,
            allQuestionsAndAnswers: data.allQuestionsAndAnswers,
            result: data.result
        });
        res.status(201).json({
            message: "saved",
            data: speaking
          });
    } catch (e) {
      res.status(404);
      console.log(e.stack);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

  const getSavedResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const id = data.id;
    try {
        console.log(id)
        const speaking = await Speaking.findOne({
          _id: id,
          user_id: req.user.uid
        });
        res.status(201).json(speaking);
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }    
  });

export{saveResults, getSavedResults};