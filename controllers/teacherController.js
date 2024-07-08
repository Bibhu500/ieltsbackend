import TeacherReview from "../models/teacherReviewModel.js";
import ListeningSaved from "../models/listeningSavedModel.js";
import ReadingSaved from "../models/readingSavedModel.js";
import Speaking from "../models/speakingModel.js";
import Teacher from "../models/teacherModel.js";
import User from "../models/userModel.js";
import { Writing } from "../models/writingModel.js";

const getTeacherInfo = async (req, res, next) => {
    const id = req.user.uid;
    try{
        const teacher = await Teacher.findOne({ firebaseId: id });
        return res.json(teacher);
    } catch (err) {
        next(err);
    }
}

const getStudentList = async (req, res, next) => {
    const id = req.user.uid;
    
    try {
      const teacher = await Teacher.findOne({ firebaseId: id });
  
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      const studentIds = teacher.students;
      const students = await User.find({ firebaseId: { $in: studentIds } });
  
      res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  };

  const addStudent = async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      await Teacher.updateOne(
        { firebaseId: req.user.uid },
        { $addToSet: { students: user.firebaseId } }
      );
  
      return res.json({ message: "Student added successfully" });
    } catch (err) {
      next(err);
    }
  };

  const removeStudent = async (req, res, next) => {
    const { firebaseId } = req.body;
    try {
      const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const studentIndex = teacher.students.indexOf(firebaseId);
      if (studentIndex === -1) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      teacher.students.splice(studentIndex, 1);
      await teacher.save();
  
      return res.json({ message: "Student deleted successfully" });
    } catch (err) {
        next(err);
    }
  };
  
  const getStudentTests = async(req, res, next) => {
    const { id } = req.body;
    try{
        const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
        if(!teacher.students.includes(id)){
            return res.status(404).json({ message: "Student not found in your list" });
        }
        const speaking = await Speaking.find({user_id: id});
        const listening = await ListeningSaved.find({user_id: id});
        const writing = await Writing.find({user_id: id});
        const reading = await ReadingSaved.find({user_id: id});
        return res.json({
            speaking,
            listening,
            writing,
            reading
        })
    } catch (err) {
        next(err);
    }
  }

  const reviewStudentTest = async (req, res, next) => {
    const { user_id, type, testData } = req.body;
    try{
        const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
        if(!teacher.students.includes(user_id)){
            return res.status(404).json({ message: "Student not found in your list" });
        }
        const review = await TeacherReview.create({
            student_id: user_id,
            teacher_id: req.user.uid,
            type: type,
            test_data: testData
        });
        res.json(review);
    } catch (err) {
        next(err);
    }
  }

  const dashboardData = async(req, res, next) => {
    try{
      const studentCount = await Teacher.aggregate([
        { $match: { firebaseId: req.user.uid } },
        {
          $project: {
            studentCount: {
              $cond: {
                if: { $isArray: '$students' },
                then: { $size: '$students' },
                else: 0,
              },
            },
          },
        },
      ]);
      const total_reviews = await TeacherReview.countDocuments({ teacher_id: req.user.uid });
      const total_students = studentCount[0].studentCount;
      res.json({
        total_students,
        total_reviews,
      });
    } catch (err) {
      next(err);
    }
  } 


export {getTeacherInfo, getStudentList, addStudent, removeStudent, getStudentTests, reviewStudentTest, dashboardData};