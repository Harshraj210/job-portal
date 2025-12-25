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
    const { name, email, password, role, phoneNumber } = req.body;
    if (!name || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    const userexist = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (userexist) {
      if (userexist.email === email)
        return res.status(409).json({ message: "Email already exists" });

      if (userexist.phoneNumber === phoneNumber)
        return res.status(409).json({ message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
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
    let { email, password, role } = req.body;
    email = (email || "").trim().toLowerCase();

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all details!!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password!!" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role access!!" });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Store JWT token inside HTTP-Only cookie
    return res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.name}!!`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed!!" });
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
    if (user.otp !== hashedotp) {
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
      return res
        .status(400)
        .json({ message: "Email, password and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedotp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.otp !== hashedotp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
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
// logged-in user profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      bio,
      experience,
      education,
      qualifications,
      skills,
    } = req.body;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !bio ||
      !experience ||
      !education ||
      !qualifications ||
      !skills
    ) {
      return res.status(400).json({ message: "Please fill all details" });
    }
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phoneNumber,
        bio,
        experience,
        education,
        qualifications,
        skills,
      },
      { new: true }
    );

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
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
  updateProfile,
  getProfile,
};
