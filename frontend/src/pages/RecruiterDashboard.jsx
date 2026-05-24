import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import {
  Loader2,
  PlusCircle,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  BarChart3,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

const StatCard = ({ icon: Icon, label, value, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 backdrop-blur-md ${colorClass} bg-current`}>
         <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  </motion.div>
);

const ActionCard = ({ to, title, description, icon: Icon, color, delay }) => (
  <Link to={to} className="block w-full h-full">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`h-full p-6 rounded-2xl border bg-white hover:border-${color}-300 transition-all cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-${color}-500/10 hover:shadow-xl`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <h3 className={`font-bold text-lg text-gray-900 mb-2 group-hover:text-${color}-700 transition-colors`}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
      <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-${color}-600`}>
         <ArrowRight className="w-5 h-5" />
      </div>
    </motion.div>
  </Link>
);

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    hiredCandidates: 0,
    interviewsScheduled: 0,
    acceptanceRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, analyticsRes] = await Promise.all([
          api.get("/company/check").catch(() => ({ data: { hasCompany: false } })),
          api.get("/applications/analytics").catch(() => ({ data: null }))
        ]);
        
        setHasCompany(companyRes.data.hasCompany);
        if (analyticsRes.data) {
          setAnalytics(analyticsRes.data);
        }
      } catch (error) {
        console.error("Dashboard init error", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "recruiter") fetchData();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-[#7315c7]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden font-sans">
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-100/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#7315c7]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-64 -left-32 w-[400px] h-[400px] bg-blue-400/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* --- Hero Section --- */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-[#7315c7] text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Recruiter Workspace
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Build Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#7315c7] to-pink-500 bg-clip-text text-transparent">Dream Team</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl font-medium">
              Welcome back, <span className="text-gray-900 font-bold">{user?.name}</span>. Streamline your hiring process, discover top talent, and manage candidates efficiently.
            </p>
          </motion.div>
        </div>

        {!hasCompany ? (
          /* --- Empty State / Onboarding --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-purple-500/5 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building2 className="w-64 h-64" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-inner flex-shrink-0">
                  <Building2 className="w-10 h-10 text-[#7315c7]" />
               </div>
               <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete Your Setup</h2>
                  <p className="text-gray-500 mb-6 font-medium leading-relaxed max-w-lg">
                    Before you can start posting jobs and reviewing applicants, we need a few details about your company to create your verified employer profile.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Verify Account
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-900 bg-purple-50 px-4 py-3 rounded-lg border border-purple-100 w-fit">
                        <div className="w-5 h-5 rounded-full border-2 border-[#7315c7] flex items-center justify-center">
                           <div className="w-2.5 h-2.5 bg-[#7315c7] rounded-full" />
                        </div>
                        Register Company Details
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" /> Start Hiring
                     </div>
                  </div>

                  <Link
                    to="/register-company"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7315c7] text-white font-bold rounded-xl hover:bg-[#5e11a3] hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 group"
                  >
                    Register Company Profile
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
          </motion.div>
        ) : (
          /* --- Dashboard Content --- */
          <div className="space-y-12">
            
            {/* Analytics Overview */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <BarChart3 className="w-5 h-5 text-purple-500" /> Pipeline Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Briefcase} label="Active Jobs" value={analytics.activeJobs} colorClass="text-blue-500" delay={0.1} />
                <StatCard icon={Users} label="Total Applicants" value={analytics.totalApplicants} colorClass="text-purple-500" delay={0.2} />
                <StatCard icon={Calendar} label="Interviews Scheduled" value={analytics.interviewsScheduled} colorClass="text-orange-500" delay={0.3} />
                <StatCard icon={TrendingUp} label="Candidates Hired" value={analytics.hiredCandidates} colorClass="text-green-500" delay={0.4} />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-yellow-500" /> Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard 
                  to="/recruiter-dashboard/post-job" 
                  title="Post a New Job" 
                  description="Publish a new opportunity and reach thousands of top-tier candidates instantly."
                  icon={PlusCircle}
                  color="purple"
                  delay={0.1}
                />
                <ActionCard 
                  to="/recruiter-dashboard/manage-jobs" 
                  title="Manage Listings" 
                  description="Edit job details, close filled positions, or review active listing metrics."
                  icon={Briefcase}
                  color="blue"
                  delay={0.2}
                />
                <ActionCard 
                  to="/recruiter-dashboard/applications" 
                  title="Review Applications" 
                  description="Filter, shortlist, and manage candidates across all your active job postings."
                  icon={Users}
                  color="green"
                  delay={0.3}
                />
              </div>
            </div>

            {/* Feature Bento Grid (Visual Enhancements) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-200/60">
               <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                       <Search className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Candidate Matching</h3>
                    <p className="text-gray-400 font-medium max-w-md">
                      Let our algorithms do the heavy lifting. We automatically surface the most relevant candidates for your roles based on skills, experience, and intent.
                    </p>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50 rounded-3xl p-8 relative overflow-hidden">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                     <TrendingUp className="w-6 h-6 text-[#7315c7]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Insights</h3>
                  <p className="text-gray-600 font-medium text-sm">
                    Track your hiring velocity and bottleneck stages with our real-time analytics engine.
                  </p>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
