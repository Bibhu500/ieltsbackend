import asyncHandler from "express-async-handler";
import { combinedTest } from "../models/combinedTestModel";

const saveResults = asyncHandler(async (req, res) => {
    const { data } = req.body;
    try {
        console.log(data);
        const combined = await combinedTest.create({
            user_id: req.user.uid,
            reading: data.reading,
            writing: data.writing,
            listening: data.listening,
            speaking: data.speaking
        });
        console.log(combined);
        res.status(201).json({
            message: "saved",
            data: combined
          });
    } catch (e) {
      res.status(404);
      var errorMessage = e.message;
      throw new Error(errorMessage);
    }
  });

export{saveResults};