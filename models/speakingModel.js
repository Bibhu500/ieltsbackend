import mongoose from "mongoose";

const SpeakingSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    allQuestionsAndAnswers: { type: Array, required: true },
    result: { 
      type: Object, 
      required: true,
      ieltsInfo: {
        overallBand: { type: Number, required: true },
        sectionalBand: {
          FluencyCoherence: { type: Number, required: true },
          LexicalResource: { type: Number, required: true },
          GrammaticalRangeAccuracy: { type: Number, required: true },
          Pronunciation: { type: Number, required: true }
        },
        feedback: { type: String },
        mistakes: { type: Array }
      }
    },
    overallBand: { type: Number, required: true }, // Add this line
    share_id: { type: String, required: true },
    remarks: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Speaking = mongoose.model("Speaking", SpeakingSchema);
export default Speaking;