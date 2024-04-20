import express from "express";

import {saveResults, getSavedResults} from "../controllers/speakingController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/saveresult").post(verifyToken, saveResults);
router.route("/fetch-saved").post(verifyToken, getSavedResults);

export default router;