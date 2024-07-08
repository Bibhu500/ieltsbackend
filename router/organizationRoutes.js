import express from "express";
import { verifyTeacher } from "../middlewares/teacherMiddleware.js";
import { createOrganization, getAllOrganization, joinOrganization } from "../controllers/organizationController.js";

const router = express.Router();
router.route("/add-new").post(verifyTeacher, createOrganization);
router.route("/get-list").get(verifyTeacher, getAllOrganization);
router.route("/join").post(verifyTeacher, joinOrganization);

export default router;