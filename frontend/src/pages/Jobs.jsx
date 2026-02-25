import { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";
import JobCard from "../components/JobCard";
import { Search, MapPin, Filter, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Search States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Filter States
  const [filters, setFilters] = useState({
    jobType: [],
    salaryRange: [0, 2000000], // Default range 0 - 20L
    sortBy: "latest",
  });

  // Redirect recruiters
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter-dashboard");
    }
  }, [user, navigate]);

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Keyword Search
        const matchKeyword =
          !searchKeyword ||
          job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          job.companyName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchKeyword.toLowerCase());

        // Location Search
        const matchLocation =
          !searchLocation ||
          job.location.toLowerCase().includes(searchLocation.toLowerCase());
        
        // Job Type Filter
        const matchType = 
            filters.jobType.length === 0 || 
            filters.jobType.includes(job.jobType);

        // Salary Filter (Simple parsing assumption: "5-10 LPA" -> extract numbers or just logic. 
        // Since backend data varies, we'll try a rough parse if possible, or skip if data is messy.
        // For now, simpler implementation: if salary filter is active, check if job salary string contains relevant text? 
        // BETTER: Assume client-side filtering on string matching is hard for salary ranges without structured data. 
        // I will implement the job type and text search first which are robust.)
        
        return matchKeyword && matchLocation && matchType;
      })
      .sort((a, b) => {
        if (filters.sortBy === "latest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (filters.sortBy === "salaryHigh") {
            // Very rough string comparison fallback
            return b.salary.localeCompare(a.salary, undefined, { numeric: true });
        } else if (filters.sortBy === "salaryLow") {
            return a.salary.localeCompare(b.salary, undefined, { numeric: true });
        }
        return 0;
      });
  }, [jobs, searchKeyword, searchLocation, filters]);

  const handleJobTypeChange = (type) => {
    setFilters(prev => {
        const newTypes = prev.jobType.includes(type)
            ? prev.jobType.filter(t => t !== type)
            : [...prev.jobType, type];
        return { ...prev, jobType: newTypes };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- TOP SEARCH SECTION --- */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 border focus-within:ring-2 ring-[#7315c7] transition-all">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search job title, company, or keywords..."
                className="w-full bg-transparent p-3 outline-none text-gray-700"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 border focus-within:ring-2 ring-[#7315c7] transition-all">
              <MapPin className="text-gray-400" />
              <input
                type="text"
                placeholder="City, state, or remote"
                className="w-full bg-transparent p-3 outline-none text-gray-700"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 bg-gray-200 px-4 py-3 rounded-lg font-medium"
            >
                <Filter size={20} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex gap-6">
        
        {/* --- FILTERS SIDEBAR (Desktop) / DRAWER (Mobile) --- */}
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            md:relative md:transform-none md:w-64 md:shadow-none md:bg-transparent md:inset-auto md:z-auto md:block
            ${showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full md:h-auto overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                     <SlidersHorizontal size={20} /> Filters
                 </h3>
                 <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-500">
                     <X size={24} />
                 </button>
             </div>

             {/* Job Type Filter */}
             <div className="mb-6">
                 <h4 className="font-semibold mb-3">Job Type</h4>
                 <div className="space-y-2">
                     {["Full-time", "Part-time", "Internship", "Contract", "Remote"].map(type => (
                         <label key={type} className="flex items-center gap-2 cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={filters.jobType.includes(type)}
                                onChange={() => handleJobTypeChange(type)}
                                className="w-4 h-4 text-[#7315c7] rounded focus:ring-[#7315c7]"
                             />
                             <span className="text-gray-600">{type}</span>
                         </label>
                     ))}
                 </div>
             </div>
             
             {/* Salary Range (Visual Only for now) */}
             <div className="mb-6">
                 <h4 className="font-semibold mb-3">Salary Range</h4>
                 <input type="range" className="w-full accent-[#7315c7]" />
                 <div className="flex justify-between text-sm text-gray-500 mt-2">
                     <span>₹0</span>
                     <span>₹50L+</span>
                 </div>
             </div>

             {/* Experience Level (Visual Only for now) */}
             <div className="mb-6">
                 <h4 className="font-semibold mb-3">Experience Level</h4>
                 <div className="space-y-2">
                     {["Fresher", "1-3 Years", "3-5 Years", "5+ Years"].map(exp => (
                         <label key={exp} className="flex items-center gap-2 cursor-pointer">
                             <input type="radio" name="experience" className="text-[#7315c7] focus:ring-[#7315c7]" />
                             <span className="text-gray-600">{exp}</span>
                         </label>
                     ))}
                 </div>
             </div>

           </div>
           
           {/* Mobile Backdrop */}
           {showFilters && (
               <div className="fixed inset-0 bg-black/50 z-[-1] md:hidden" onClick={() => setShowFilters(false)}></div>
           )}
        </aside>

        {/* --- MAIN JOB LIST --- */}
        <main className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">
                    Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> jobs
                </p>
                
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm hidden sm:inline">Sort by:</span>
                    <select 
                        className="bg-white border rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-[#7315c7]"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                        <option value="latest">Latest</option>
                        <option value="salaryHigh">Salary: High to Low</option>
                        <option value="salaryLow">Salary: Low to High</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7315c7]"></div>
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map(job => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-20">
                    <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-[#7315c7] w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No jobs found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredJobs.length > 10 && (
                <div className="mt-8 flex justify-center">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                        Load More Jobs
                    </button>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
