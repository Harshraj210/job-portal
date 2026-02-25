import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // security purpose
import mongoose from "mongoose";


import applicationRoutes from "./routes/applicationRoute.js";
import companyRoutes from "./routes/CompanyRoute.js";
import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import interviewRoutes from "./routes/interviewRoute.js";
import connectDB from "./Database/db.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;


// Middleware
// app.use(cors());


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);


app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);
// Serve uploads
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get('/', (req, res) => {
  return res
    .status(200)
    .json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
