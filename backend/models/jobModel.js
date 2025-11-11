import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time", "Internship", "Contract"],
    default: "Full-time",
  },
  salary:{
    type:String,
    required:true,

  },
  postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
},
  {
    timestamps: true, 
  }
);
const Job = mongoose.model("Job", jobSchema);
export default Job
