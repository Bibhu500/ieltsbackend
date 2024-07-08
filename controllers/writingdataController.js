import { WritingData } from '../models/writingDataModel.js';

export const createWritingData = async (req, res) => {
  try {
    const { question_number, text, image, description, type } = req.body;

    const newWritingData = new WritingData({
      question_number,
      text,
      image,
      description,
      type,
    });

    const savedWritingData = await newWritingData.save();
    res.status(201).json(savedWritingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
