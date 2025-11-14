import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appilication = mongoose.model("Application", applicationSchema);
export default Appilication;
