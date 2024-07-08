import express from "express";
import { verifyTeacher } from "../middlewares/teacherMiddleware.js";
import { addStudent, dashboardData, getStudentList, getStudentTests, getTeacherInfo, removeStudent, reviewStudentTest } from "../controllers/teacherController.js";

const router = express.Router();
router.route("/get-profile").get(verifyTeacher, getTeacherInfo);
router.route("/get-students").get(verifyTeacher, getStudentList);
router.route("/add-student").post(verifyTeacher, addStudent);
router.route("/remove-student").post(verifyTeacher, removeStudent);
router.route("/get-student-tests").post(verifyTeacher, getStudentTests);
router.route("/add-remark").post(verifyTeacher, reviewStudentTest);
router.route("/fetch-dashboard").get(verifyTeacher, dashboardData);

export default router;