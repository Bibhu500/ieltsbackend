import mongoose from "mongoose";

const ListeningSchema = mongoose.Schema(
  {
    set_id: { type: Number, required: true },
    question: { type: String, required: true },
    audio: { type: String, required: true },
    transcript: { type: String, required: true },
    allQuestionsAndAnswers:{ type: Array, required: true}, 
  },
  {
    timestamps: true,
  }
);

const Listening = mongoose.model("Listening", ListeningSchema);
export default Listening;


// Individual Question Format

// {
//     question: "",
//     options: [],
//     type: "",
//     userAnswer: [],
//     correctAnswer: []
// }


// {
//     set_id: 1,
//     question: "",
//     audio: "",
//     transcript: "",
//     allQuestionsAndAnswers: [

//     ] 
// }