import express from "express";

import { saveResults, getSavedResults, getSharedResults, getWritingData } from "../controllers/writingController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/saveResult").post(verifyToken, saveResults);
router.route("/fetch-saved").post(verifyToken, getSavedResults);
router.route("/share/:shareId").get(getSharedResults);
router.route("/").post(verifyToken, getWritingData);

export default router;