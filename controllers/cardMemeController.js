import asyncHandler from "express-async-handler";
import {cardMemeData}  from "../models/cardMemeModel.js";

const saveMemeResults = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
      console.log("Received data:", data);
      console.log("User ID:", req.user.uid);

      if (!data.meaning) {
          console.warn("Warning: 'meaning' field is empty or undefined");
      }

      let createdDate = Date.now();
      const memeData = new cardMemeData({
          header: data.header,
          meaning: data.meaning,
          image_url: data.image_url,
          sentence: data.sentence,
          synonyms: data.synonyms,
          antonyms: data.antonyms,
          parts_of_speech: data.parts_of_speech,
          verbforms: data.verbforms,
          cref_type: data.cref_type,
          createdBy: req.user.uid,
          createdDate: createdDate
      });

      console.log("Meme data to be saved:", memeData);

      let savedData = await memeData.save();
      console.log("Saved meme data:", savedData);

      res.status(201).json({
          message: "saved",
          data: savedData
      });
  } catch (e) {
      console.error("Error saving meme:", e);
      res.status(500).json({
          message: "Error saving meme",
          error: e.message
      });
  }
});




const findMemeResults = asyncHandler(async (req, res, next) => {
try {
    console.log(req.user.uid,"data");
    const findData = await cardMemeData.find();
    console.log(findData);
    res.status(200).json({
        message: "Meme Data",
        data: findData
        });
} catch (e) {
    next(e);
}
});

export{saveMemeResults,findMemeResults};