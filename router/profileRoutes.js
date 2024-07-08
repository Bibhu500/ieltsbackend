import express from "express";

import {
    fetchResults,
    getProfile
} from "../controllers/profileController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/fetch-results").get(verifyToken, fetchResults);
router.route("/get-profile").get(verifyToken, getProfile);

export default router;