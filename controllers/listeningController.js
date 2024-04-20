import Listening from "../models/listeningModel.js";
import ListeningSaved from "../models/listeningSavedModel.js";
import asyncHandler from "express-async-handler";


const getTestSet = asyncHandler(async (req, res) => {
    try {
        const listening = await Listening.aggregate([{ $sample: { size: 1 } }])
        res.status(200).json({
            data: listening[0]
          });
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
});


const saveResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
        const listening = await ListeningSaved.create({
            user_id: req.user.uid,
            set_id: data.set_id,
            audio: data.audio,
            transcript: data.transcript,
            question: data.question,
            allQuestionsAndAnswers: data.allQuestionsAndAnswers,
            results: data.result
        });

        res.status(201).json({
            message: "saved",
            data: listening
          });
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

export{saveResults, getTestSet};