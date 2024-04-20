import express from "express";

import { sendRequest, acceptRequest, rejectRequest, getAllNotifications } from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/").get(verifyToken, getAllNotifications);
router.route("/sendRequest").post(verifyToken, sendRequest);
router.route("/acceptRequest").post(verifyToken, acceptRequest);
router.route("/rejectRequest").post(verifyToken, rejectRequest);

export default router;