import mongoose from "mongoose";

const combinedTestSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    writing: {type: Object},
    speaking: {type: Object},
    reading: {type: Object},
    listening: {type: Object}
  },
  {
    timestamps: true,
  }
);

const combinedTest = mongoose.model("combinedTest", combinedTestSchema);

export {combinedTest};