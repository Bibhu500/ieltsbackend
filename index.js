//server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import speakingRoutes from "./router/speakingRoutes.js"
import writingRoutes from "./router/writingRoutes.js"
import profileRoutes from "./router/profileRoutes.js"
import listeningRoutes from "./router/listeningRoutes.js"
import meme from "./router/cardMemeRoutes.js";

import ReadingRoutes from "./router/ReadingRoutes.js";
import vocabularyRoutes from "./router/vocabularyRoutes.js"
import teacherRoutes from "./router/teacherRoutes.js";
import organizationRoutes from "./router/organizationRoutes.js";
import cors from "cors";
import notificationRoutes from "./router/notificationRoutes.js";
import morgan from "morgan";
import errorHandler from "./middlewares/errorMiddleware.js";
import helmet from "helmet";
import journeyRoutes from "./router/journeyRoutes.js";


dotenv.config();



connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
app.use(helmet());

app.get("/", (req, res) => {
  res.send(`Hello World`);
});
// server.js
app.get("/api/journey/test", (req, res) => {
  res.json({ message: "Journey routes working" });
});
app.use("/api/users", userRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/meme",meme)

app.use("/api/writing", writingRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/reading", ReadingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/ielts-mocktest", notificationRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/journey", journeyRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);