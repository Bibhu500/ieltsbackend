import mongoose from "mongoose";

const SpeakingSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    allQuestionsAndAnswers: { type: Array, required: true },
    result: { type: Object, required: true },
    editor_id: {type: String},
    share_id: {type: String, required: true},
    remarks: {type: Object},
  },
  {
    timestamps: true,
  }
);

const Speaking = mongoose.model("Speaking", SpeakingSchema);
export default Speaking;