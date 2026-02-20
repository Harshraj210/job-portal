import express from "express"
import { handleLogin,handleRegister,logOut,forgotPassword,requestotp,verifyOtp,resetPassword,updateProfile,getProfile, uploadResume, deleteResume } from "../controllers/userController.js"
import { protectRoute } from "../middleware/authMiddleware.js"
import sendEmail from "../utils/send_email.js";


import multer from "multer";
import path from "path";
import fs from "fs";

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/resumes/";
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Resume must be PDF, DOC, or DOCX only!"));
    }
});

const router = express.Router();

router.post("/register",handleRegister)
router.post("/login",handleLogin)
router.post("/logout",protectRoute,logOut);
router.post("/profile/update",protectRoute,updateProfile);
router.post("/upload-resume", protectRoute, upload.single('resume'), uploadResume);
router.delete("/delete-resume", protectRoute, deleteResume);
// Serve static files (quick fix, though usually done in index.js)
// Better to ensure index.js serves /uploads

router.post("/forgot-password", forgotPassword);
router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await sendEmail({ to, subject, text });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});
router.post("/request-otp", requestotp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;