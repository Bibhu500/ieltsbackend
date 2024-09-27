// models/listeningResultModel.js
import mongoose from 'mongoose';

const ListeningResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  listeningSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListeningSet',
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

const ListeningResult = mongoose.model('ListeningResult', ListeningResultSchema);

export default ListeningResult;