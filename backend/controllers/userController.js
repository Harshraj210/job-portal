import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

const handleRegister = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;
    if (!name || !email || !password || !role || !phoneNumber) {
      return res.status(404).json({ message: "Please fill all details" });
    }

    const userexist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userexist) {
      if (userexist.email === email) {
        return res.status(409).json({ message: "Email already in use" });
      }
      if (userexist.phoneNumber === phoneNumber) {
        return res.status(409).json({ message: "Phone number already in use" });
      }
      return res.status(409).json({ message: "User already exist!!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profilePicture: req.file?.path,
    });
    return res.status(200).json({
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
      .status(400)
      .json({ message: "Error in registering User", error });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "Please fill all details!!" });
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
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(401).json({ message: "Login failed!!" });
  }
};

export { handleRegister, handleLogin };
