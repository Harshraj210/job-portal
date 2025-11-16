import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
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
