import express from "express"
import { handleLogin,handleRegister,logOut,forgotPassword,requestotp,verifyOtp,resetPassword,updateProfile,getProfile } from "../controllers/userController.js"
import { protectRoute } from "../middleware/authMiddleware.js"
import sendEmail from "../utils/send_email.js";


const router = express.Router();

router.post("/register",handleRegister)
router.post("/login",handleLogin)
router.post("/logout",protectRoute,logOut);
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