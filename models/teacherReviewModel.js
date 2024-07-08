import mongoose from "mongoose";

const teacherReviewSchema = mongoose.Schema(
  {
    student_id: { type: String, required: true },
    teacher_id: { type: String, required: true },
    type: { type: String, required: true },
    test_data: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const TeacherReview = mongoose.model("TeacherReview", teacherReviewSchema);
export default TeacherReview;