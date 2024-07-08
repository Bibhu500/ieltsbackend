import mongoose from "mongoose";

const ListeningSchema = mongoose.Schema(
  {
    question_number: {type: Number, required: true},
    allQuestionsAndAnswers:{ type: Array, required: true}, 
  },
  {
    timestamps: true,
  }
);

const Listening = mongoose.model("Listening", ListeningSchema);
export default Listening;