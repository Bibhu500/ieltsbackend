import mongoose from "mongoose";

const WritingDataSchema = mongoose.Schema(
  {
    question_number: {type: Number, required: true},
    image: { type: String },
    text: { type: String, required: true },
    description: { type: String },
    type: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const WritingData = mongoose.model("WritingData", WritingDataSchema);

export {WritingData};



