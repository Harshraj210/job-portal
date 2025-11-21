import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) return res.status(401).json({ message: "No token" });

  const token = authheader.split(" ")[1];
  if (!token)
     return res.
    status(401)
    .json({ message: "Token missing" });

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    next();
  } else {
    res.status(403).json({ message: "Not a recruiter" });
  }
};
// Checks if you're an applicant
export const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === 'applicant') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Not an applicant' });
  }
};
