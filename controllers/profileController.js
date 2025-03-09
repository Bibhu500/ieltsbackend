//controllers/profilecontroller.js

import asyncHandler from "express-async-handler";
import Speaking from "../models/speakingModel.js";
import { Writing } from "../models/writingModel.js";
import IELTSReadingResult from "../models/IELTSReadingResultModel.js";
import { ListeningSaved } from "../models/listeningModels.js"; // Add this import
import axios from "axios";

const fetchResults = asyncHandler(async (req, res, next) => {
  // Check that req.user is defined
  if (!req.user) {
    console.error("User not authenticated in fetchResults");
    return res.status(401).json({ message: "User not authenticated" });
  }
  const uid = req.user.uid;
  console.log("Fetching results for user:", uid);
  console.log("Testing...");
  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];

  console.log("Token:", token);

  const speakingData = await axios.get(
    `${process.env.BACKEND_URL}/speaking/fetch-saved`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!speakingData.data) {
    console.log("No data found");
  }

  const speaking_data = await speakingData.data;
  const writing_data = await Writing.find({ user_id: uid });
  const reading_data = await IELTSReadingResult.find({ user_id: uid });
  const listening_data = await ListeningSaved.find({ user_id: uid });

  if (
    speaking_data.length === 0 &&
    writing_data.length === 0 &&
    reading_data.length === 0 &&
    listening_data.length === 0
  ) {
    console.log("No data found for user:", uid);
    return res.json({ message: "No test data available for this user" });
  }

  const data = {
    speaking: {
      overallBand: speaking_data.map((d) => d.result?.overallBand || 0),
      time: speaking_data.map((d) => d.createdAt),
      id: speaking_data.map((d) => d._id),
    },
    reading: {
      overallBand: reading_data.map((d) => d.overallBand || 0),
      time: reading_data.map((d) => d.createdAt),
      id: reading_data.map((d) => d._id),
    },
    writing: {
      overallBand: writing_data.map(
        (d) => d.result?.ieltsinfo?.overallBand || 0
      ),
      time: writing_data.map((d) => d.createdAt),
      id: writing_data.map((d) => d._id),
    },
    listening: {
      overallBand: listening_data.map((d) => d.overallBand || 0),
      time: listening_data.map((d) => d.createdAt),
      id: listening_data.map((d) => d._id),
    },
  };

  res.json(data);
});

const getProfile = async (req, res, next) => {
  try {
    // Log the entire req.user object for debugging

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.json({
      name: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    console.error("Error in getProfile:", err);
    next(err);
  }
};

export { fetchResults, getProfile };
