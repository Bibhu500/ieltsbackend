import express from "express";

import { sendRequest, acceptRequest, rejectRequest, getAllNotifications, deleteNotification } from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/").get(verifyToken, getAllNotifications);
router.route("/sendRequest").post(verifyToken, sendRequest);
router.route("/acceptRequest").post(verifyToken, acceptRequest);
router.route("/rejectRequest").post(verifyToken, rejectRequest);
router.route("/delete").post(verifyToken, deleteNotification);

export default router;