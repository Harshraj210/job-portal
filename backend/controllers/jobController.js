import User from "../models/userModel.js";
import Job from "../models/jobModel.js";

// public routes for appicants

const getallJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("postedBy", "name");
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name companyName"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found buddy !!" });
    }
    return res.status(200).json(job);
  } catch (error) {
    return res.status(404).json({ message: "Server Error" });
  }
};

// Ye sarre protected routes h recruiter ke liye

const createJob = async (req, res) => {
  try {
    const { title, description, companyName, location, salary, jobType } =
      req.body;

    const job = await Job.create({
      title,
      description,
      companyName,
      location,
      salary,
      jobType,
      postedBy: req.user.id, // Link the job to the logged-in recruiter
    });
    return res.status(201).json(job);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error creating job", error: error.message });
  }
};

// Get all jobs posted by the logged-in recruiter
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job Not found baby" });
    }
    //   Check if the recruiter owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this job" });
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedJob);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating job", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    return res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting job", error: error.message });
  }
};

const searchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { companyName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const filterJobs = async (req, res) => {
  try {
    const { location, jobType, minSalary, maxSalary } = req.query;

    const filter = {};
    if (location) filter.location = location;
    if (jobType) filter.jobType = jobType;
    if (minSalary || maxSalary) {
      filter.salary = {};
      // gte--> greater than equal to vice versa with lte
      if (minSalary) filter.salary.$gte = minSalary;
      if (maxSalary) filter.salary.$lte = maxSalary;
    }
    const jobs = await Job.find(filter);

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export { getallJobs, getJobById, createJob, getMyJobs, updateJob, deleteJob };
