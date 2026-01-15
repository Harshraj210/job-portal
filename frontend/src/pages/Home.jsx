import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  User,
  FileText,
  Send,
  Building2,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasCompany, setHasCompany] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);

  // Check company status ONLY if user is recruiter
  useEffect(() => {
    const checkCompanyStatus = async () => {
      if (user?.role === "recruiter") {
        try {
          const res = await api.get("/company/check");
          setHasCompany(res.data.hasCompany);
        } catch {
          setHasCompany(false);
        } finally {
          setCheckingCompany(false);
        }
      } else {
        setCheckingCompany(false);
      }
    };

    if (!authLoading) {
      checkCompanyStatus();
    }
  }, [user, authLoading]);

  if (authLoading || (user?.role === "recruiter" && checkingCompany)) {
    return null; // or spinner
  }

  // --- RECRUITER VIEW ---
  if (user?.role === "recruiter") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-50 to-transparent pointer-events-none" />
        
        <main className="flex-grow flex items-center justify-center relative z-10 py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-[#7315c7] px-4 py-2 rounded-full font-semibold text-sm mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7315c7]"></span>
                </span>
                <span>Hiring Platform</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
                Build Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7315c7] to-blue-600">
                  Dream Team
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Welcome back, <span className="font-bold text-gray-900">{user.name}</span>. 
                Streamline your hiring process, manage candidates efficiently, and find the perfect match for your company culture.
              </p>

              {hasCompany ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/recruiter-dashboard"
                    className="flex items-center justify-center px-8 py-4 bg-[#7315c7] text-white font-bold rounded-xl hover:bg-[#5e11a3] transition-all shadow-lg hover:shadow-purple-200 hover:-translate-y-1"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/recruiter-dashboard/post-job"
                    className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-1"
                  >
                    Post a New Job
                  </Link>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 max-w-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#7315c7]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Setup Required</h3>
                      <p className="text-sm text-gray-500">Register your company to start hiring.</p>
                    </div>
                  </div>
                  <Link
                    to="/register-company"
                    className="block w-full py-3 bg-[#7315c7] text-white font-bold rounded-lg text-center hover:bg-[#5e11a3] transition-colors"
                  >
                    Register Company Profile
                  </Link>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8 text-gray-400">
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-gray-900">500+</span>
                  <span className="text-sm">Companies</span>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-gray-900">10k+</span>
                  <span className="text-sm">Candidates</span>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-gray-900">98%</span>
                  <span className="text-sm">Success Rate</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* --- COMPANY LOGOS MARQUEE --- */}
        <div className="py-12 bg-white border-t border-purple-50 overflow-hidden">
          <p className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-widest">
            Trusted by Industry Leaders/ SMVIT START-UPS
          </p>
          <div className="relative flex overflow-x-hidden group">
            <motion.div
              className="flex w-max items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25,
              }}
            >
              {/* Logos (Repeated twice for seamless loop) */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-16 items-center px-8 shrink-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                    alt="Google"
                    className="h-8 md:h-10"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                    alt="Microsoft"
                    className="h-8 md:h-10"
                  />
                  <span className="text-2xl md:text-3xl font-bold text-[#7315c7] font-sans tracking-tight cursor-default">
                    Tvara
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-blue-600 font-serif italic cursor-default">
                    Zryth Solutions
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-orange-500 font-mono tracking-tighter cursor-default">
                    Zintlr
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-indigo-600 font-sans tracking-widest uppercase cursor-default border-2 border-indigo-600 px-2 py-0.5">
                    Concurrence AI
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-red-600 font-serif tracking-tight cursor-default">
                    Rudrax
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // --- APPLICANT / GUEST VIEW ---
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
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Dream Job
              </span>{" "}
              <br className="hidden md:block" /> Without the Hassle
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with top companies and startups. Whether you're hiring or
              looking for work, we've got you covered with thousands of
              opportunities.
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
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm"
                >
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Jobs
              </h2>
              <p className="text-gray-600 max-w-xl">
                Explore our hand-picked selection of top opportunities from
                leading companies.
              </p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              View all jobs{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h3>
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
            <Link
              to="/jobs"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View all jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Finding your dream job is easier than you think. Follow these
              simple steps to get started.
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
              <div
                key={index}
                className="text-center bg-white md:bg-transparent p-6 md:p-0 rounded-2xl shadow-sm md:shadow-none"
              >
                <div
                  className={`w-24 h-24 mx-auto ${step.color} rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg`}
                >
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
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

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative z-10">
              Ready to Start Your Journey?
            </h2>
            <p className="text-purple-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals who have found their dream careers
              through our platform.
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

      {/* --- COMPANY LOGOS MARQUEE (Applicant View) --- */}
      <div className="py-12 bg-white border-t border-purple-50 overflow-hidden">
        <p className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-widest">
          Trusted by Industry Leaders / SMVIT START-UPS
        </p>
        <div className="relative flex overflow-x-hidden group">
          <motion.div
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {/* Logos (Repeated twice for seamless loop) */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center px-8 shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                  alt="Google"
                  className="h-8 md:h-10"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                  alt="Microsoft"
                  className="h-8 md:h-10"
                />
                <span className="text-2xl md:text-3xl font-bold text-[#7315c7] font-sans tracking-tight cursor-default">
                  Tvara
                </span>
                <span className="text-2xl md:text-3xl font-bold text-blue-600 font-serif italic cursor-default">
                  Zryth Solutions
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-orange-500 font-mono tracking-tighter cursor-default">
                  Zintlr
                </span>
                <span className="text-xl md:text-2xl font-bold text-indigo-600 font-sans tracking-widest uppercase cursor-default border-2 border-indigo-600 px-2 py-0.5">
                  Concurrence AI
                </span>
                <span className="text-2xl md:text-3xl font-black text-red-600 font-serif tracking-tight cursor-default">
                  Rudrax
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
