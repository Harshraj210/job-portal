import { useParams } from "react-router-dom";
import api from "../lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import JobCard from "../components/JobCard";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error("Failed to load job details");
      }
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <JobCard job={job} />
    </div>
  );
};

export default JobDetails;  
