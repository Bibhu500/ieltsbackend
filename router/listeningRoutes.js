import express from "express";

import { saveResults, getTestSet } from "../controllers/listeningController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/").get(verifyToken, getTestSet)
router.route("/saveresult").post(verifyToken, saveResults);

export default router;