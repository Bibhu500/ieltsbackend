import mongoose from "mongoose";

const vocabularySchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    vocabulary: { type: Array, required: true },
  }
);

const Vocabulary = mongoose.model("vocabulary", vocabularySchema);
export default Vocabulary;