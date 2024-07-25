// controllers/ReadingController.js 
 
 import Reading from "../models/ReadingModel.js";
import IELTSReadingResult from "../models/IELTSReadingResultModel.js";
import ReadingSaved from "../models/readingSavedModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from 'uuid';

// Adding a reading passage
export const addReadingSet = asyncHandler(async (req, res, next) => {
    const { setNumber, setType, sections } = req.body;

    try {
        const newReading = new Reading({
            setId: setNumber,
            setType,
            sections: sections.map(section => ({
                sectionNumber: section.sectionNumber,
                sectionInstructions: section.sectionInstructions,
                passages: section.passages.map(passage => ({
                    passageNo: passage.passageNo,
                    passageInstructions: passage.passageInstructions,
                    passageTitle: passage.passageTitle,
                    paragraphs: passage.paragraphs,
                    questionSets: passage.questionSets.map(questionSet => ({
                        questionSetNumber: questionSet.questionSetNumber,
                        questionRange: questionSet.questionRange,
                        questionSetInstruction: questionSet.questionSetInstruction,
                        questionType: questionSet.questionType,
                        questions: questionSet.questions.map(question => ({
                            questionText: question.questionText,
                            options: question.options,
                            answer: question.answer
                        }))
                    }))
                }))
            }))
        });

        const savedReading = await newReading.save();
        res.status(201).json({ message: 'Reading set added successfully', data: savedReading });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add reading set', error });
    }
});
// Fetching a set of tests
export const getTestSet = asyncHandler(async (req, res, next) => {
    try {
      const reading = await Reading.find().sort({ setId: 1 });
      
      console.log('All reading sets:', reading.map(r => r.setId));
  
      res.status(200).json({ data: reading });
    } catch (e) {
      console.error('Error in getTestSet:', e);
      next(e);
    }
  });

// Saving results
// In ReadingController.js
// In ReadingController.js

export const saveReadingResult = asyncHandler(async (req, res, next) => {
  console.log('Received request body:', req.body);
  console.log('User object:', req.user);
  console.log('Reading Set ID:', req.body.readingSetId); // Add this line

  const { readingSetId, readingSetNumber, overallBand, totalCorrect, totalQuestions, answers } = req.body;
  
  if (!req.user || !req.user.uid) {
    console.log('User not authenticated. req.user:', req.user);
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const user_id = req.user.uid;

  try {
    console.log('Creating new IELTSReadingResult');
    const newResult = new IELTSReadingResult({
      user_id,
      readingSetId, // This is the MongoDB _id of the reading set
      readingSetNumber, // This is the setId from the Reading model
      overallBand,
      totalCorrect,
      totalQuestions,
      answers
    });

    console.log('Saving result to database');
    const savedResult = await newResult.save();
    console.log('Result saved successfully:', savedResult);
    res.status(201).json({ message: 'Reading result saved successfully', data: savedResult });
  } catch (error) {
    console.error('Error saving reading result:', error);
    res.status(500).json({ 
      message: 'Failed to save reading result', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export const getNextTest = asyncHandler(async (req, res, next) => {
  const { testType } = req.query;
  const userId = req.user.uid;

  try {
    // Get all completed tests for this user
    const completedTests = await IELTSReadingResult.find({ user_id: userId });
    const completedTestIds = completedTests.map(test => test.readingSetId.toString());

    // Find the next available test of the specified type
    const nextTest = await Reading.findOne({
      setType: testType,
      _id: { $nin: completedTestIds }
    }).sort({ setId: 1 });

    if (!nextTest) {
      return res.status(404).json({ message: 'No more tests available' });
    }

    res.status(200).json(nextTest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch next test', error });
  }
});

export const getReadingResult = asyncHandler(async (req, res, next) => {
  const { resultId } = req.params;
  try {
    const result = await IELTSReadingResult.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reading result', error });
  }
});

export const getSavedResults = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  console.log('Received ID:', id);
  try {
    const readingResult = await IELTSReadingResult.findById(id);
    console.log('Reading Result:', readingResult);
    if (!readingResult) {
      console.log('Reading result not found');
      return res.status(404).json({ message: 'Reading result not found' });
    }

    const readingSet = await Reading.findById(readingResult.readingSetId);
    console.log('Reading Set:', readingSet);
    if (!readingSet) {
      console.log('Reading set not found');
      return res.status(404).json({ message: 'Reading set not found' });
    }

    res.status(200).json({
      result: readingResult,
      set: readingSet
    });
  } catch (e) {
    console.error('Error in getSavedResults:', e);
    res.status(500).json({ message: 'Internal server error', error: e.message });
  }
});

// Getting shared results
export const getSharedResults = asyncHandler(async (req, res, next) => {
    const { shareId } = req.params;
    try {
        const reading = await ReadingSaved.findOne({
            share_id: shareId,
        });
        res.status(201).json(reading);
    } catch (e) {
        next(e);
    }    
});



