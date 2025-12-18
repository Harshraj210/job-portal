import { Link } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";

const JobCardRecruiter = ({ job }) => {
  const deleteJob = async () => {
    await api.delete(`/jobs/${job._id}/delete`);
    toast.success("Job Deleted!");
    window.location.reload();
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white flex justify-between items-center">
      <div>
        <h2 className="font-bold text-lg">{job.title}</h2>
        <p className="text-sm text-gray-500">{job.location}</p>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/edit-job/${job._id}`}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg"
        >
          Edit
        </Link>

        <Link
          to={`/job-applicants/${job._id}`}
          className="px-3 py-2 bg-green-500 text-white rounded-lg"
        >
          Applicants
        </Link>

        <button
          onClick={deleteJob}
          className="px-3 py-2 bg-red-500 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCardRecruiter;
