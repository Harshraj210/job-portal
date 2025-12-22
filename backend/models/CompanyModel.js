import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
