import express from "express"

import { handleLogin,handleRegister,logOut,forgotPassword,requestotp,verifyOtp,resetPassword } from "../controllers/userController.js"


const router = express.Router()
router.post("/register",handleRegister)
router.post("/login",handleLogin)
router.post("/logout",logOut);
router.post("/forgot-password", forgotPassword);
router.post("/request-otp", requestotp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
export default router