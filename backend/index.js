import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // security purpose
import mongoose from "mongoose";

import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobRoute.js";
import connectDB from "./Database/db.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.get('/', (req, res) => {
  return res
    .status(200)
    .json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
