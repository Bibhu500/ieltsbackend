import mongoose from "mongoose";

// Schema for Listening Sets

const ListeningSetSchema = new mongoose.Schema({
  setNumber: { type: String, required: true },
  mp3Link: { type: String, required: true },
  pdfLink: { type: String, required: true },
  answers: [[{ type: String }]],
  user_id: { type: String, required: true },
}, { 
  timestamps: true
});


// Schema for Saved Listening Results
const ListeningSavedSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  setId: { type: String, required: true },
  listeningSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'ListeningSet', required: true },
  overallBand: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionId: String,
    userAnswer: String,
    isCorrect: Boolean
  }],
  mp3Link: { type: String, required: true },
  pdfLink: { type: String, required: true }
}, {
  timestamps: true,
});

// Models
const ListeningSet = mongoose.models.ListeningSet || mongoose.model("ListeningSet", ListeningSetSchema);
const ListeningSaved = mongoose.models.ListeningSaved || mongoose.model("ListeningSaved", ListeningSavedSchema);

export { ListeningSet, ListeningSaved };
