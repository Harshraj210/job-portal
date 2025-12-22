import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { _id: decode.userId, role: decode.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    next();
  } else {
    res.status(403).json({ message: "Not a recruiter" });
  }
};
// Checks if you're an applicant
const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === "applicant") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Not an applicant" });
  }
};

export { protectRoute, isRecruiter, isApplicant };
