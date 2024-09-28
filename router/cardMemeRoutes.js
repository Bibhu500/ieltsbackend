import express from "express";
import { saveMemeResults, findMemeResults } from "../controllers/cardMemeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/saveMeme").post(verifyToken, saveMemeResults);
router.route("/findMeme").get(verifyToken, findMemeResults);

export default router;