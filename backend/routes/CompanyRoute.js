import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import multer from "multer";
import { registerCompany, getCompany, getCompanyById, updateCompany , checkCompanyExists,} from "../controllers/CompanyCotroller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.get("/check", protectRoute, isRecruiter, checkCompanyExists);
router.post("/register", protectRoute, registerCompany);
router.get("/get", getCompany);
router.get("/get/:id", getCompanyById);
router.put("/update/:id", updateCompany);

export default router;