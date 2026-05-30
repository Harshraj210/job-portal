import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import applicationRoutes from "./routes/applicationRoute.js";
import companyRoutes from "./routes/CompanyRoute.js";
import authRoutes from "./routes/authRoute.js";
import jobRoutes from "./routes/jobRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import interviewRoutes from "./routes/interviewRoute.js";
import connectDB from "./Database/db.js";
import { initRedis } from "./config/redis.js";

dotenv.config();
connectDB();
initRedis();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "https://job-portal-five-virid.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, Render health checks, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  // Must explicitly list methods and headers or browsers block preflight
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  optionsSuccessStatus: 200, // Fixed typo: was optionSuccessStatus (ignored by cors module)
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);

// Serve uploaded files (resumes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

