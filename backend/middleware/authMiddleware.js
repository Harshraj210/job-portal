import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Fail fast if SECRET_KEY is not set — catches Render env-var misconfiguration at startup
if (!process.env.SECRET_KEY) {
  console.error("FATAL: SECRET_KEY environment variable is not set. Auth will fail for all requests.");
}

const protectRoute = (req, res, next) => {
  try {
    // 1. Try cookie first
    let token = req.cookies?.jwt;

    // 2. Fallback: Authorization: Bearer <token> header
    //    Required for cross-origin requests where cookies are blocked
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      console.warn("[Auth] No token found — cookie:", !!req.cookies?.jwt, "| header:", req.headers.authorization || "none");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      console.error("[Auth] SECRET_KEY is undefined — cannot verify token");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = { _id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    // JsonWebTokenError, TokenExpiredError, etc.
    console.error("[Auth] Token verification failed:", error.name, "-", error.message);
    return res.status(401).json({ message: "Authentication failed: " + error.message });
  }
};

const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === "recruiter") {
    next();
  } else {
    res.status(403).json({ message: "Not a recruiter" });
  }
};

const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === "applicant") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Not an applicant" });
  }
};

export { protectRoute, isRecruiter, isApplicant };
