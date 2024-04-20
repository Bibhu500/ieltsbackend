import mongoose from "mongoose";

const ReadingSchema = mongoose.Schema(
  {
    set_id: { type: Number, required: true },
    passageTitle: { type: String, required: true },
    passage: { type: String, required: true },
    allQuestionsAndAnswers:{ type: Array, required: true}, 
  },
  {
    timestamps: true,
  }
);

const Reading = mongoose.model("Reading", ReadingSchema);
export default Reading;