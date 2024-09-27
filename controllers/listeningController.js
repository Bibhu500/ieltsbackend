import { ListeningSet, ListeningSaved } from "../models/listeningModels.js";
import asyncHandler from "express-async-handler";

export const getListeningTest = asyncHandler(async (req, res, next) => {
  const userId = req.user.uid;

  try {
    // Get all completed tests for this user
    const completedTests = await ListeningSaved.find({ user_id: userId });
    const completedSetNumbers = completedTests.map(test => test.setId);

    // Find all available test sets
    const allTestSets = await ListeningSet.find().sort({ setNumber: 1 });

    // Find the next available test
    let nextTest = allTestSets.find(test => !completedSetNumbers.includes(test.setNumber));

    // If all tests have been completed, start over
    if (!nextTest && allTestSets.length > 0) {
      nextTest = allTestSets[0];
    }

    if (!nextTest) {
      return res.status(404).json({ message: 'No tests available' });
    }

    res.status(200).json(nextTest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch next test', error: error.message });
  }
});

export const saveListeningResult = asyncHandler(async (req, res, next) => {
  const { listeningSetId, setNumber, overallBand, totalCorrect, totalQuestions, answers, mp3Link, pdfLink } = req.body;
  const user_id = req.user.uid;

  console.log('Received data:', JSON.stringify(req.body, null, 2));

  try {
    if (!setNumber) {
      throw new Error('setNumber is required');
    }

    const newResult = new ListeningSaved({
      user_id,
      setId: setNumber,
      listeningSetId,
      overallBand: Number(overallBand),
      totalCorrect: Number(totalCorrect),
      totalQuestions: Number(totalQuestions),
      answers,
      mp3Link,
      pdfLink
    });

    console.log('New result object:', JSON.stringify(newResult.toObject(), null, 2));

    const savedResult = await newResult.save();
    console.log('Saved result:', JSON.stringify(savedResult.toObject(), null, 2));
    res.status(201).json({ message: 'Listening result saved successfully', data: savedResult });
  } catch (error) {
    console.error('Error saving listening result:', error);
    res.status(500).json({ 
      message: 'Failed to save listening result',
      error: error.message
    });
  }
});

export const getListeningResult = asyncHandler(async (req, res, next) => {
  const { resultId } = req.params;
  try {
    const result = await ListeningSaved.findById(resultId).lean();
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    console.log('Fetched result:', JSON.stringify(result, null, 2));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getListeningResult:', error);
    res.status(500).json({ message: 'Failed to fetch listening result', error: error.message });
  }
});

export const saveListeningSet = asyncHandler(async (req, res, next) => {
  const { setNumber, mp3Link, pdfLink, answers } = req.body;
  try {
    const listeningSet = await ListeningSet.create({
      setNumber,
      mp3Link,
      pdfLink,
      answers,
      user_id: req.user.uid,
    });

    res.status(201).json({
      message: "Listening set saved successfully",
      data: listeningSet,
    });
  } catch (e) {
    next(e);
  }
});

