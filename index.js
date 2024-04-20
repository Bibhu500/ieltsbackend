import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import speakingRoutes from "./router/speakingRoutes.js"
import writingRoutes from "./router/writingRoutes.js"
import profileRoutes from "./router/profileRoutes.js"
import listeningRoutes from "./router/listeningRoutes.js"
import readingRoutes from "./router/ReadingRoutes.js";
import vocabularyRoutes from "./router/vocabularyRoutes.js"

import cors from "cors";
import notificationRoutes from "./router/notificationRoutes.js";
import morgan from "morgan";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.get("/", (req, res) => {
  res.send(`Hello World`);
});

app.use("/api/users", userRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);