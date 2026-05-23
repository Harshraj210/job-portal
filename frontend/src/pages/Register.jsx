import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail, Lock, User, Phone, Briefcase, ArrowRight, Loader2,
  Eye, EyeOff, Sparkles, CheckCircle2, Star, TrendingUp,
  FileText, Bell, Search, CheckCircle, Users, BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Mini card inside floating square ───────────────────────────── */
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
      className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md px-3 py-2.5 flex items-center gap-2.5 min-w-[130px]"
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

/* ─── Floating orb ─────────────────────────────────────────────────  */
const FloatingOrb = ({ className, delay = 0, duration = 8 }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ─── Feature pill for left panel ────────────────────────────────── */
const Highlight = ({ icon: Icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="flex items-center gap-2.5 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5"
  >
    <Icon className="w-4 h-4 text-purple-300 flex-shrink-0" />
    <span className="text-sm text-white/75 font-medium">{text}</span>
  </motion.div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "applicant", phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await register(
        formData.name, formData.email, formData.password,
        formData.role, formData.phoneNumber
      );
      toast.success("Account created successfully!");
      if (data?.user?.role === "recruiter") {
        navigate("/recruiter-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all duration-300 bg-gray-50/80 text-gray-900 placeholder:text-gray-400 ${
      focusedField === field
        ? "border-[#7315c7] ring-2 ring-[#7315c7]/15 bg-white shadow-sm shadow-[#7315c7]/10"
        : "border-gray-200 hover:border-gray-300 hover:bg-white/60"
    }`;

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][passwordStrength];

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#fafafa]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#0f0a1e]">
        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-15%] w-[480px] h-[480px] rounded-full bg-[#7315c7]/28 blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[380px] h-[380px] rounded-full bg-[#4f0fa0]/22 blur-[80px]" />
          <div className="absolute top-[55%] left-[20%] w-[180px] h-[180px] rounded-full bg-[#9333ea]/12 blur-[50px]" />
        </div>

        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Floating job-portal mini cards ── */}
        <JobCard
          icon={FileText}
          label="Resume Viewed"
          sub="3 recruiters today"
          color="#a78bfa"
          delay={0}
          duration={9}
          pos={{ top: "10%", right: "5%", maxWidth: 165 }}
        />
        <JobCard
          icon={BarChart2}
          label="App. Status"
          sub="2 Under Review"
          color="#60a5fa"
          delay={1.5}
          duration={8}
          pos={{ top: "46%", right: "16%", maxWidth: 158 }}
        />
        <JobCard
          icon={Search}
          label="AI Job Match"
          sub="94% compatibility"
          color="#34d399"
          delay={3}
          duration={10}
          pos={{ bottom: "23%", left: "3%", maxWidth: 165 }}
        />
        <motion.div
          className="absolute z-10"
          style={{ bottom: "9%", right: "9%" }}
          animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.3, duration: 0.4 }}
            className="w-11 h-11 rounded-xl border border-purple-400/30 bg-purple-500/15 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Bell size={18} className="text-purple-300" />
          </motion.div>
        </motion.div>

        {/* Orbs */}
        <FloatingOrb
          className="absolute top-[32%] left-[7%] w-3 h-3 rounded-full bg-purple-400/30 border border-purple-400/20"
          delay={0.5} duration={5}
        />
        <FloatingOrb
          className="absolute top-[62%] right-[5%] w-2 h-2 rounded-full bg-pink-400/40"
          delay={1} duration={4}
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
              Start Your Journey
            </p>
            <h1 className="text-4xl xl:text-[2.7rem] font-extrabold text-white leading-[1.2] tracking-tight">
              Your next big <br />
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                opportunity awaits.
              </span>
            </h1>
            <p className="mt-4 text-white/45 text-sm leading-relaxed max-w-xs">
              Create your free account and connect with top companies actively hiring right now.
            </p>
          </motion.div>

          <div className="space-y-3">
            <Highlight icon={CheckCircle2} text="Free account, always" delay={0.3} />
            <Highlight icon={Star} text="Curated job recommendations" delay={0.4} />
            <Highlight icon={TrendingUp} text="Track all your applications" delay={0.5} />
          </div>
        </div>

        {/* ── Bottom badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 rounded-2xl bg-white/5 border border-white/8 px-5 py-4 backdrop-blur-sm"
        >
          <p className="text-white/35 text-xs mb-1">This month alone</p>
          <p className="text-white text-sm font-semibold">
            <span className="text-purple-300 font-bold text-base">12,400+</span> new job listings added
          </p>
        </motion.div>
      </div>

      {/* ══════════════ RIGHT PANEL (form) ══════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 py-8 relative overflow-hidden">
        {/* Bg blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7315c7]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* ── MOBILE BRANDING (hidden on lg+) ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:hidden w-full max-w-[420px] mb-7 flex flex-col items-center text-center"
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
            Your career journey starts here
          </p>
        </motion.div>


        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#7315c7] font-semibold hover:underline underline-offset-2">
                Sign in →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">
                I am joining as
              </label>
              <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-gray-100 rounded-xl">
                {[
                  { value: "applicant", label: "Job Seeker", icon: User },
                  { value: "recruiter", label: "Recruiter", icon: Briefcase },
                ].map(({ value, label, icon: Icon }) => (
                  <motion.button
                    key={value}
                    type="button"
                    id={`role-${value}`}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData({ ...formData, role: value })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      formData.role === value
                        ? "bg-white text-[#7315c7] shadow-sm border border-[#7315c7]/20"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">Full Name</label>
              <div className="relative">
                <User
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "name" ? "text-[#7315c7]" : "text-gray-400"}`}
                  size={17}
                />
                <input
                  type="text" name="name" id="register-name" required
                  placeholder="Enter your full name"
                  className={inputClass("name")}
                  value={formData.name} onChange={handleChange}
                  onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">Email</label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "email" ? "text-[#7315c7]" : "text-gray-400"}`}
                  size={17}
                />
                <input
                  type="email" name="email" id="register-email" required
                  placeholder="Enter your email address"
                  className={inputClass("email")}
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">Phone Number</label>
              <div className="relative">
                <Phone
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "phoneNumber" ? "text-[#7315c7]" : "text-gray-400"}`}
                  size={17}
                />
                <input
                  type="text" name="phoneNumber" id="register-phone" required
                  placeholder="Enter your phone number"
                  className={inputClass("phoneNumber")}
                  value={formData.phoneNumber} onChange={handleChange}
                  onFocus={() => setFocusedField("phoneNumber")} onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">Password</label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === "password" ? "text-[#7315c7]" : "text-gray-400"}`}
                  size={17}
                />
                <input
                  type={showPassword ? "text" : "password"} name="password" id="register-password" required
                  placeholder="Create a strong password"
                  className={`${inputClass("password")} pr-11`}
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
                      <motion.span key="eye-off" initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 10 }} transition={{ duration: 0.15 }}>
                        <EyeOff size={15} />
                      </motion.span>
                    ) : (
                      <motion.span key="eye" initial={{ opacity: 0, rotate: 10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -10 }} transition={{ duration: 0.15 }}>
                        <Eye size={15} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Strength meter */}
              {formData.password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5 pt-0.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= passwordStrength ? strengthColor : "#e5e7eb" }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel} password</p>
                </motion.div>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit" id="register-submit" disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.018, y: isLoading ? 0 : -1.5 }}
              whileTap={{ scale: isLoading ? 1 : 0.975 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7315c7] to-[#8e24e0] hover:from-[#6412b5] hover:to-[#7d1fd4] shadow-lg shadow-[#7315c7]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              {!isLoading && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  animate={{ x: ["-100%", "250%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
              )}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={17} />
                    Creating account…
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Create Account <ArrowRight size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By creating an account, you agree to our{" "}
            <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-[#7315c7] transition-colors">Terms of Service</span>{" "}
            &{" "}
            <span className="text-gray-600 underline underline-offset-2 cursor-pointer hover:text-[#7315c7] transition-colors">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
