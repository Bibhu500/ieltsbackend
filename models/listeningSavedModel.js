import mongoose from "mongoose";

const ListeningSavedSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true},
    set_id: { type: Number, required: true },
    question: { type: String, required: true },
    audio: { type: String, required: true },
    transcript: { type: String, required: true },
    allQuestionsAndAnswers:{ type: Array, required: true}, 
    results: { type: Object, required: true}
  },
  {
    timestamps: true,
  }
);

const ListeningSaved = mongoose.model("ListeningSaved", ListeningSavedSchema);
export default ListeningSaved;
