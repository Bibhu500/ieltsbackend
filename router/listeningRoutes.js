import express from "express";

import { saveResults, getListeningData, getSavedListeningResults} from "../controllers/listeningController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/").get(verifyToken, getListeningData)
router.route("/saveresult").post(verifyToken, saveResults);
router.route("/fetch-saved").post(verifyToken, getSavedListeningResults);
export default router;