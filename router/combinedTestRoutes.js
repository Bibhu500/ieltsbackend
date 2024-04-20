import express from "express";

import { saveResults } from "../controllers/combinedTestController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/saveResult").post(verifyToken, saveResults);

export default router;