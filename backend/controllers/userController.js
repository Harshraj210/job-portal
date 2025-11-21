import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import crypto from "crypto";
import generateOTP from "../utils/otp_Generator.js";
import sendEmail from "../utils/send_email.js";

dotenv.config();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

const handleRegister = async (req, res) => {
  try {
    let { name, email, password, role, phoneNumber } = req.body;
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    phoneNumber = (phoneNumber || "").trim();

    if (!name || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    const userexist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userexist) {
      console.log("User Exist", userexist);
      
      if (userexist.email === email) {
        return res
          .status(409)
          .json({ message: "User name with this email already exists" });
      }
      if (userexist.phoneNumber === phoneNumber) {
        return res
          .status(409)
          .json({ message: "User name with this phone number already exists" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profilePicture: req.file?.path || null,
    });
    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        profilePicture: newUser.profilePicture,
      },
      token: generateToken(newUser._id, newUser.role),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in registering User", error });
  }
};

const handleLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all details!!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usernot Found!!" });
    }
    const safePassword = await bcrypt.compare(password, user.password);
    if (!safePassword) {
      return res.status(401).json({ message: "Invalid Password!!" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(401).json({ message: "Login failed!!" });
  }
};

 const logOut = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ message: "Logged out successfully" });
};


const forgotPassword = async (req, res) => {
  return requestotp(req, res);
};

const requestotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOTP();
    const hashedotp = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedotp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is : ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: "Error in generating OTP", error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  const hashedotp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.otp !== hashedotp ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in verifying OTP", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp)
      return res.status(400).json({ message: "Email, password and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

export {
  handleRegister,
  handleLogin,
  logOut,
  forgotPassword,
  requestotp,
  verifyOtp,
  resetPassword,
};
