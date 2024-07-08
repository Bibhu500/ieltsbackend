import mongoose from "mongoose";

const ListeningSavedSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true},
    question_number: { type: Number, required: true },
    allQuestionsAndAnswers:{ type: Array, required: true}, 
    results: { type: Object, required: true}
  },
  {
    timestamps: true,
  }
);

const ListeningSaved = mongoose.model("ListeningSaved", ListeningSavedSchema);
export default ListeningSaved;
