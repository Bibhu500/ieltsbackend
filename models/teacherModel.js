import mongoose from "mongoose";

const teacherSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseId: { type: String, required: true },
    organization_id: { type: String },
    students: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;

// name, id, address, insaan ka name, no of student
