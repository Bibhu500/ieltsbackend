//readingSavedModel.js

import mongoose from "mongoose";

const ReadingSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    editor_id: { type: String },
    share_id: { type: String, required: true },
    passages:{ type: Array, required: true}, 
    results: { type: Object, required: true},
  },
  {
    timestamps: true,
  }
);

const ReadingSaved = mongoose.model("ReadingSaved", ReadingSchema);
export default ReadingSaved;