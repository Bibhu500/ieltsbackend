// routes/journeyRoutes.js
import express from "express";
import { updateJourney, getJourney } from "../controllers/journeyController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/update')
  .post(verifyToken, updateJourney);

router.route('/get')
  .get(verifyToken, getJourney);

export default router;

