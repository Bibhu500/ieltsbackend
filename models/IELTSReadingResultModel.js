//models/IELTSReadingResultModel.js

import mongoose from 'mongoose';

const IELTSReadingResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  readingSetId: {
    type: String,
    required: true
  },
  overallBand: {
    type: Number,
    required: true
  },
  totalCorrect: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: String,
    userAnswer: String,
    isCorrect: Boolean
  }]
}, {
  timestamps: true
});

const IELTSReadingResult = mongoose.model('IELTSReadingResult', IELTSReadingResultSchema);

export default IELTSReadingResult;