//router/writingRouter.js

import express from "express";
import { createWritingData } from '../controllers/writingdataController.js';
import { saveResults, getSavedWritingResults, getSharedResults, getWritingData,getRemainingTests, addRemark } from "../controllers/writingController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/saveResult").post(verifyToken, saveResults);
router.route("/fetch-saved").post(verifyToken, getSavedWritingResults);
router.route("/share/:shareId").get(getSharedResults);
router.route("/share/add-remark").post(verifyToken, addRemark);
router.route("/").post(verifyToken, getWritingData);
router.post('/writingdata', createWritingData);

router.route("/remaining-tests").get(verifyToken, getRemainingTests);


export default router;