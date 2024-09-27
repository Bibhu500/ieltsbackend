//server/routes/listeningRoutes.js

import express from "express";
import {
  getListeningTest,
  saveListeningResult,getListeningResult,saveListeningSet
} from "../controllers/listeningController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/get-test").get(verifyToken, getListeningTest);
router.route("/save-result").post(verifyToken, saveListeningResult);
router.route("/result/:resultId").get(verifyToken, getListeningResult);
router.post("/save-set", verifyToken, saveListeningSet);


export default router;