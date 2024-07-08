import asyncHandler from "express-async-handler";
import Vocabulary from "../models/vocabularyModel.js";

const save = asyncHandler(async (req, res, next) => {
  const data = req.body;
  try {
    let vocabulary = await Vocabulary.findOne({ user_id: req.user.uid });

    if (vocabulary) {
      vocabulary.vocabulary = data;
      await vocabulary.save();
    } else {
      vocabulary = await Vocabulary.create({
        user_id: req.user.uid,
        vocabulary: data
      });
    }

    res.status(200).json({
      data: "saved"
    });
  } catch (e) {
    next(e);
  }
});

const getVocabularyList = asyncHandler(async (req, res, next) => {
    try {
        let vocabulary = await Vocabulary.findOne({ user_id: req.user.uid });
        if(vocabulary){
            res.status(200).json({
                data: vocabulary.vocabulary
            });
        }else{
            res.status(200).json({
                data: []
            });
        }
    } catch (e) {
      next(e);
    }
});

export { save, getVocabularyList };
