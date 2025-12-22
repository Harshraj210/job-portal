import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, ArrowRight, User, FileText, Send, CheckCircle } from "lucide-react";

const Home = () => {
  // Dummy data for featured jobs
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Creative Studio",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $100k",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="bg-white border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                #1 Job Board for Tech Talent
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]"
            >
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Job</span> <br className="hidden md:block" /> Without the Hassle
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with top companies and startups. Whether you're hiring or looking for work, we've got you covered with thousands of opportunities.
            </motion.p>

            {/* Search Bar Mockup */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-100/50 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 border border-gray-100"
            >
              <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  readOnly // Visual only for now
                />
              </div>
              <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl border-t sm:border-t-0 border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                  readOnly // Visual only for now
                />
              </div>
              <Link
                to="/jobs"
                className="h-14 px-8 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
              >
                Search
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { label: "Active Jobs", value: "10k+" },
                { label: "Companies", value: "500+" },
                { label: "Daily Users", value: "25k+" },
                { label: "Hired", value: "8k+" },
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED JOBS SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
              <p className="text-gray-600 max-w-xl">
                Explore our hand-picked selection of top opportunities from leading companies.
              </p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
              View all jobs <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-500 mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                    {job.location}
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                    {job.type}
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                    {job.salary}
                  </span>
                </div>

                <Link
                  to={`/jobs/${job.id}`} // Assuming this route exists or will exist
                  className="block w-full py-3 text-center bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View all jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">
              Finding your dream job is easier than you think. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

            {[
              {
                icon: User,
                title: "Create Account",
                desc: "Sign up for free and set up your professional profile in minutes.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: FileText,
                title: "Upload Resume",
                desc: "Upload your CV so recruiters can find you and match you with jobs.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Send,
                title: "Apply for Jobs",
                desc: "Browse thousands of jobs and apply with just a single click.",
                color: "bg-pink-100 text-pink-600",
              },
            ].map((step, index) => (
              <div key={index} className="text-center bg-white md:bg-transparent p-6 md:p-0 rounded-2xl shadow-sm md:shadow-none">
                <div className={`w-24 h-24 mx-auto ${step.color} rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#7315c7] rounded-3xl p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-200">
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative z-10">Ready to Start Your Journey?</h2>
            <p className="text-purple-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals who have found their dream careers through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-[#7315c7] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/register-company"
                className="px-8 py-4 bg-purple-800 text-white font-bold rounded-xl hover:bg-purple-900 transition-all border border-purple-700"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;