import { ListeningSet, ListeningSaved } from "../models/listeningModels.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getListeningTest = asyncHandler(async (req, res, next) => {
  const userId = req.user.uid;

  try {
    console.log(`Fetching listening test for user: ${userId}`);

    // Fetch the user from the database
    const user = await User.findOne({ firebaseId: userId });
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User details:`, JSON.stringify(user, null, 2));
    console.log(`User role from database: ${user.role}`);

    const userRole = user.role;
    let freeTestsLeft = 2;
    let limitReached = false;

    // Find all available test sets
    const allTestSets = await ListeningSet.find().sort({ setNumber: 1 });
    console.log(`Total available test sets: ${allTestSets.length}`);

    if (allTestSets.length === 0) {
      console.log('No tests available');
      return res.status(404).json({ message: 'No tests available' });
    }

    // Get all completed tests for this user
    const completedTests = await ListeningSaved.find({ user_id: userId });
    console.log(`Completed tests: ${completedTests.length}`);

    const completedSetNumbers = completedTests.map(test => test.setId);
    console.log(`Completed set numbers: ${completedSetNumbers.join(', ')}`);

    // Find the next available test
    let nextTest = allTestSets.find(test => !completedSetNumbers.includes(test.setNumber));

    // If all tests have been completed, start over
    if (!nextTest) {
      nextTest = allTestSets[0];
    }

    console.log(`Next test set number: ${nextTest.setNumber}`);

    if (userRole === 'student') {
      freeTestsLeft = Math.max(0, 2 - completedTests.length);
      console.log(`Free tests left for student: ${freeTestsLeft}`);
      if (freeTestsLeft === 0) {
        limitReached = true;
      }
    } else if (userRole === 'premiumstudent') {
      freeTestsLeft = -1; // Indicate unlimited tests
      limitReached = false; // Ensure limitReached is always false for premium students
      console.log(`Premium student: unlimited tests`);
    } else {
      console.log(`Unknown user role: ${userRole}`);
    }

    console.log(`Sending response - Role: ${userRole}, Free tests left: ${freeTestsLeft}, Limit reached: ${limitReached}`);

    res.status(200).json({
      testData: nextTest,
      userRole,
      freeTestsLeft,
      limitReached
    });
  } catch (error) {
    console.error('Error in getListeningTest:', error);
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

