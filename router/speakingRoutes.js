import express from "express";

import {saveResults, getSavedSpeakingResults, getSharedResults, addRemark} from "../controllers/speakingController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/saveresult").post(verifyToken, saveResults);
router.route("/fetch-saved").post(verifyToken, getSavedSpeakingResults);
router.route("/share/:shareId").get(getSharedResults);
router.route("/share/add-remark").post(verifyToken, addRemark);

export default router;