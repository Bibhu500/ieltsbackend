import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkPendingTest, exitTest, submitSection, submitTest } from "../controllers/IeltsFullMocktestController.js";

const router = express.Router();
app.route('/:section').post(verifyToken, submitSection);
app.route('/submit').post(verifyToken, submitTest);
app.route('/').get(verifyToken, checkPendingTest);
app.route('/exit-test').get(verifyToken, exitTest);

export default router;