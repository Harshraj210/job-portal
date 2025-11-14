import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobRoute.js";
import connectDB from "./Database/db.js";

dotenv.config();
connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
