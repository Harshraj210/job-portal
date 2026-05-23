import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  Users,
  ChevronDown,
  Briefcase,
  FileText,
  TrendingUp,
  Star,
  Search,
  Bell,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Mini card that lives inside each floating square ─────────────── */
const JobCard = ({ icon: Icon, label, sub, color, delay, duration = 9, pos }) => (
  <motion.div
    className="absolute z-10"
    style={pos}
    animate={{ y: [0, -14, 0], rotate: [0, 4, 0], scale: [1, 1.02, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md shadow-xl shadow-black/20 px-3 py-2.5 flex items-center gap-2.5 min-w-[130px]"
      style={{ boxShadow: `0 8px 32px ${color}22, 0 2px 8px rgba(0,0,0,0.3)` }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}33`, border: `1px solid ${color}55` }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-white text-[11px] font-semibold leading-tight truncate">{label}</p>
        {sub && <p className="text-white/45 text-[9px] leading-tight mt-0.5 truncate">{sub}</p>}
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Small floating dot/orb ───────────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0, duration = 8 }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ─── Feature bullet for left panel ─────────────────────────────── */
const Feature = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="flex items-start gap-3"
  >
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
      <Icon className="w-4 h-4 text-purple-200" />
    </div>
    <div>
      <p className="text-sm font-semibold text-white/90">{title}</p>
      <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "applicant",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(formData.email, formData.password, formData.role);
      toast.success("Welcome back!");
      if (from) {
        navigate(from, { replace: true });
      } else if (data?.user?.role === "recruiter") {
        navigate("/recruiter-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all duration-300 bg-gray-50/80 text-gray-900 placeholder:text-gray-400 ${
      focusedField === field
        ? "border-[#7315c7] ring-2 ring-[#7315c7]/15 bg-white shadow-sm shadow-[#7315c7]/10"
        : "border-gray-200 hover:border-gray-300 hover:bg-white/60"
    }`;

  return (
    <div
      className="min-h-screen flex overflow-hidden bg-[#fafafa]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#0f0a1e]">
        {/* Layered radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7315c7]/30 blur-[110px]" />
          <div className="absolute bottom-[-10%] right-[-15%] w-[420px] h-[420px] rounded-full bg-[#4f0fa0]/20 blur-[90px]" />
          <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] rounded-full bg-[#9333ea]/15 blur-[60px]" />
        </div>

        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Floating job-portal mini cards ── */}
        <JobCard
          icon={Briefcase}
          label="New Job Match"
          sub="Senior Dev · Remote"
          color="#a78bfa"
          delay={0}
          duration={9}
          pos={{ top: "11%", right: "6%", maxWidth: 160 }}
        />
        <JobCard
          icon={Bell}
          label="Interview Invite"
          sub="Google · Tomorrow 10am"
          color="#34d399"
          delay={1.5}
          duration={8}
          pos={{ top: "44%", right: "14%", maxWidth: 175 }}
        />
        <JobCard
          icon={TrendingUp}
          label="Profile Views"
          sub="+34 this week"
          color="#60a5fa"
          delay={3}
          duration={10}
          pos={{ bottom: "16%", left: "4%", maxWidth: 155 }}
        />
        <motion.div
          className="absolute z-10"
          style={{ bottom: "8%", right: "10%" }}
          animate={{ y: [0, -8, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.3, duration: 0.4 }}
            className="w-11 h-11 rounded-xl border border-[#7315c7]/35 bg-[#7315c7]/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-[#7315c7]/20"
          >
            <Star size={18} className="text-purple-300" />
          </motion.div>
        </motion.div>

        {/* Small orbs */}
        <FloatingOrb
          className="absolute top-[30%] left-[8%] w-3 h-3 rounded-full bg-purple-400/30 border border-purple-400/20"
          delay={0.5}
          duration={5}
        />
        <FloatingOrb
          className="absolute top-[60%] right-[6%] w-2 h-2 rounded-full bg-pink-400/40"
          delay={1}
          duration={4}
        />

        {/* ── Brand ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7315c7] to-[#9333ea] flex items-center justify-center shadow-lg shadow-[#7315c7]/40">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Hire<span className="text-purple-300">Nova</span>
          </span>
        </motion.div>

        {/* ── Hero copy ── */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-purple-300/80 text-xs font-semibold tracking-widest uppercase mb-3">
              Your Career, Elevated
            </p>
            <h1 className="text-4xl xl:text-[2.7rem] font-extrabold text-white leading-[1.2] tracking-tight">
              Find your dream <br />
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                role today.
              </span>
            </h1>
            <p className="mt-4 text-white/45 text-sm leading-relaxed max-w-xs">
              Join thousands of professionals landing top roles at the world's
              most exciting companies.
            </p>
          </motion.div>

          <div className="space-y-4">
            <Feature icon={Shield} title="Verified Recruiters" desc="Every company is identity-verified before posting." delay={0.3} />
            <Feature icon={Zap} title="Instant Matches" desc="AI-powered matching delivers relevant roles in seconds." delay={0.4} />
            <Feature icon={Users} title="500k+ Professionals" desc="A growing community of ambitious job seekers." delay={0.5} />
          </div>
        </div>

        {/* ── Bottom trust badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {["#7315c7", "#a855f7", "#ec4899"].map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#0f0a1e] flex items-center justify-center"
                style={{ background: c }}
              >
                <Users size={10} className="text-white" />
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs">
            <span className="text-white/70 font-medium">2,400+</span> hires made this month
          </p>
        </motion.div>
      </div>

      {/* ══════════════ RIGHT PANEL (form) ══════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-8 relative overflow-hidden">
        {/* Subtle bg blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#7315c7]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* ── MOBILE BRANDING (hidden on lg+) ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:hidden w-full max-w-[400px] mb-8 flex flex-col items-center text-center"
        >
          {/* Logo mark */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7315c7] to-[#9333ea] flex items-center justify-center shadow-lg shadow-[#7315c7]/30 mb-3">
            <Sparkles size={18} className="text-white" />
          </div>
          {/* Brand name */}
          <span className="font-extrabold text-gray-900 text-xl tracking-tight">
            Hire<span className="text-[#7315c7]">Nova</span>
          </span>
          {/* Tagline */}
          <p className="mt-1.5 text-sm text-gray-400 font-medium">
            Find your next opportunity
          </p>
        </motion.div>


        {/* ── Form card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Card header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Sign in to continue your journey.{" "}
              <Link
                to="/register"
                className="text-[#7315c7] font-semibold hover:underline underline-offset-2 transition-all"
              >
                Create account →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "email" ? "text-[#7315c7]" : "text-gray-400"
                  }`}
                  size={17}
                />
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  required
                  placeholder="you@example.com"
                  className={inputClass("email")}
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">
                Sign in as
              </label>
              <div className="relative">
                <select
                  name="role"
                  id="login-role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClass("role")} appearance-none cursor-pointer pl-4`}
                  required
                >
                  <option value="applicant">Job Seeker / Applicant</option>
                  <option value="recruiter">Recruiter</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#7315c7] font-medium hover:underline underline-offset-2 transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === "password" ? "text-[#7315c7]" : "text-gray-400"
                  }`}
                  size={17}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="login-password"
                  required
                  placeholder="••••••••"
                  className={`${inputClass("password")} pr-11`}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
                      <motion.span
                        key="eye-off"
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff size={16} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="eye"
                        initial={{ opacity: 0, rotate: 10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.018, y: isLoading ? 0 : -1.5 }}
              whileTap={{ scale: isLoading ? 1 : 0.975 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7315c7] to-[#8e24e0] hover:from-[#6412b5] hover:to-[#7d1fd4] shadow-lg shadow-[#7315c7]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Shimmer overlay */}
              {!isLoading && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full"
                  animate={{ x: ["-100%", "250%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                />
              )}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" size={17} />
                    Signing in…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Sign In <ArrowRight size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-[#7315c7] transition-colors">Terms</span>{" "}
            &{" "}
            <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-[#7315c7] transition-colors">Privacy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
