import mongoose from "mongoose";

const IeltsFullMocktestSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true},
    speaking: {type: Object},
    listening: {type: Object},
    reading: {type: Object},
    writing: {type: Object},
    overallResult: {type: Number},
    isTestCompleted: { type: Boolean, default: false}, 
  },
  {
    timestamps: true,
  }
);

const IeltsFullMocktest = mongoose.model("IeltsFullMocktest", IeltsFullMocktestSchema);
export default IeltsFullMocktest;