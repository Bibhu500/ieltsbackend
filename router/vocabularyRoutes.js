import express from "express";

import { getVocabularyList, save } from "../controllers/vocabularyController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/save").post(verifyToken, save);
router.route("/getVocabulary").get(verifyToken, getVocabularyList);

export default router;