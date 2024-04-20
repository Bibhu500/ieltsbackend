import express from "express";

import {
    fetchResults
} from "../controllers/profileController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.route("/fetch-results").get(verifyToken, fetchResults);

export default router;