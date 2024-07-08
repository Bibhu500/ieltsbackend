//model/userModel.js

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseId: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'teacher', 'admin'], default: 'student' },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;