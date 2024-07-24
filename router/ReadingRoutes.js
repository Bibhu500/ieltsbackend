//ReadingRoutes.js
import express from "express";
import { addReadingSet, getTestSet,getReadingResult,getNextTest, getSavedResults, getSharedResults } from "../controllers/ReadingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { saveReadingResult } from "../controllers/ReadingController.js";


const router = express.Router();

router.route("/add").post(verifyToken, addReadingSet);
router.route("/").get(verifyToken, getTestSet);
router.route("/fetch-saved").post(verifyToken, getSavedResults);
router.route("/share/:shareId").get(getSharedResults);
router.route("/saveresult").post(verifyToken, saveReadingResult);
router.route("/result/:resultId").get(verifyToken, getReadingResult);
router.route("/next-test").get(verifyToken, getNextTest);



export default router;
