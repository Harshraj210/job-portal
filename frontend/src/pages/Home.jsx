import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  Search, MapPin, Briefcase, ArrowRight, User, FileText,
  Send, Building2, LayoutDashboard, Star, Sparkles,
  Code2, Palette, TrendingUp, Database, Megaphone,
  Shield, Zap, Globe, CheckCircle2,
} from "lucide-react";
import heroPng from "../assets/hero-professional.png";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, delay } },
});
// Cinematic slide-in from right for hero image panel
const slideFromRight = {
  hidden: { opacity: 0, x: 72, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};
// Zoom-in scale for category cards
const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.86, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
});

// ── Floating brand icons ──────────────────────────────────────────────────────
const floatingIcons = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", alt: "Google", style: "top-[8%] right-[2%]", delay: 0 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg", alt: "Slack", style: "top-[38%] right-[-4%]", delay: 0.3 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", alt: "LinkedIn", style: "bottom-[18%] right-[-2%]", delay: 0.6 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", alt: "GitHub", style: "top-[6%] left-[4%]", delay: 0.2 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", alt: "Figma", style: "bottom-[22%] left-[0%]", delay: 0.5 },
];

// ── Avatar trust indicator ────────────────────────────────────────────────────
const avatarColors = ["#5B5FF8", "#10b981", "#f59e0b", "#ef4444"];
const avatarLetters = ["A", "R", "M", "S"];

// ── Popular search tags ───────────────────────────────────────────────────────
const popularTags = ["UI/UX Design", "Web Development", "Human Resources", "Product Design", "Marketing"];

// ── Job categories ────────────────────────────────────────────────────────────
const categories = [
  { icon: Code2,      label: "Engineering",   count: "1,240 jobs", color: "bg-blue-50 text-blue-600",   ring: "group-hover:ring-blue-200" },
  { icon: Palette,    label: "Design",        count: "480 jobs",   color: "bg-pink-50 text-pink-500",   ring: "group-hover:ring-pink-200" },
  { icon: TrendingUp, label: "Marketing",     count: "620 jobs",   color: "bg-amber-50 text-amber-500", ring: "group-hover:ring-amber-200" },
  { icon: Briefcase,  label: "Product",       count: "390 jobs",   color: "bg-indigo-50 text-[#5B5FF8]",ring: "group-hover:ring-indigo-200" },
  { icon: Database,   label: "Data Science",  count: "510 jobs",   color: "bg-emerald-50 text-emerald-600", ring: "group-hover:ring-emerald-200" },
  { icon: Megaphone,  label: "Sales",         count: "340 jobs",   color: "bg-orange-50 text-orange-500", ring: "group-hover:ring-orange-200" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Ananya Sharma",   role: "Frontend Developer at Tvara",      text: "Found my dream job within 2 weeks. The search filters are incredibly powerful and the apply process is frictionless.",  color: "#5B5FF8" },
  { name: "Rohan Mehta",     role: "Product Designer at Zryth Solutions", text: "HireNova's platform feels like it was built by people who actually understand what job seekers need. Absolutely seamless.", color: "#10b981" },
  { name: "Meera Patel",     role: "Data Analyst at Concurrence AI",    text: "I got three interview calls in my first week. The category filtering and company profiles are top-notch.",             color: "#f59e0b" },
];

// ── Scroll-reveal wrapper (supports zoom mode for category cards) ─────────────
const Reveal = ({ children, delay = 0, className = "", zoom = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const initial = zoom
    ? { opacity: 0, scale: 0.86, y: 12 }
    : { opacity: 0, y: 28 };
  const animate = zoom
    ? inView ? { opacity: 1, scale: 1, y: 0 } : {}
    : inView ? { opacity: 1, y: 0 } : {};
  return (
    <motion.div ref={ref} className={className}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

// ── Company logos marquee (shared, untouched) ─────────────────────────────────
const LogosMarquee = () => (
  <div className="py-12 bg-white border-t border-gray-100 overflow-hidden">
    <p className="text-center text-xs font-semibold text-gray-400 mb-8 uppercase tracking-widest">
      Trusted by Industry Leaders / SMVIT START-UPS
    </p>
    <div className="relative flex overflow-x-hidden">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center px-8 shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8 md:h-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-8 md:h-10" />
            <span className="text-2xl md:text-3xl font-bold text-[#7315c7] font-sans tracking-tight cursor-default">Tvara</span>
            <span className="text-2xl md:text-3xl font-bold text-blue-600 font-serif italic cursor-default">Zryth Solutions</span>
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500 font-mono tracking-tighter cursor-default">Zintlr</span>
            <span className="text-xl md:text-2xl font-bold text-indigo-600 font-sans tracking-widest uppercase cursor-default border-2 border-indigo-600 px-2 py-0.5">Concurrence AI</span>
            <span className="text-2xl md:text-3xl font-black text-red-600 font-serif tracking-tight cursor-default">Rudrax</span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasCompany, setHasCompany] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkCompanyStatus = async () => {
      if (user?.role === "recruiter") {
        try {
          const res = await api.get("/company/check");
          setHasCompany(res.data.hasCompany);
        } catch { setHasCompany(false); }
        finally { setCheckingCompany(false); }
      } else { setCheckingCompany(false); }
    };
    if (!authLoading) checkCompanyStatus();
  }, [user, authLoading]);

  if (authLoading || (user?.role === "recruiter" && checkingCompany)) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagSearch = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RECRUITER VIEW — preserve original logic, improved styling
  // ══════════════════════════════════════════════════════════════════════════
  if (user?.role === "recruiter") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none" />
        <main className="flex-grow flex items-center justify-center relative z-10 py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp(0)} className="text-left">
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-[#5B5FF8] px-4 py-2 rounded-full font-semibold text-sm mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5B5FF8]" />
                </span>
                <span>Hiring Platform</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
                Build Your <br />
                <span className="text-[#5B5FF8]">Dream Team</span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 max-w-xl leading-relaxed">
                Welcome back, <span className="font-bold text-gray-900">{user.name}</span>.{" "}
                Streamline your hiring process, manage candidates efficiently, and find the perfect match.
              </p>
              {hasCompany ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/recruiter-dashboard" className="flex items-center justify-center px-8 py-4 bg-[#5B5FF8] text-white font-bold rounded-xl hover:bg-[#4a4ee0] transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
                    <LayoutDashboard className="w-5 h-5 mr-2" /> Go to Dashboard
                  </Link>
                  <Link to="/recruiter-dashboard/post-job" className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-0.5">
                    Post a New Job
                  </Link>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 max-w-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#5B5FF8]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Setup Required</h3>
                      <p className="text-sm text-gray-500">Register your company to start hiring.</p>
                    </div>
                  </div>
                  <Link to="/register-company" className="block w-full py-3 bg-[#5B5FF8] text-white font-bold rounded-lg text-center hover:bg-[#4a4ee0] transition-colors">
                    Register Company Profile
                  </Link>
                </div>
              )}
              <div className="mt-12 flex items-center gap-8 text-gray-400">
                {[["500+", "Companies"], ["10k+", "Candidates"], ["98%", "Success Rate"]].map(([v, l]) => (
                  <div key={l} className="flex flex-col">
                    <span className="font-black text-2xl text-gray-900">{v}</span>
                    <span className="text-sm">{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
        <LogosMarquee />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // APPLICANT VIEW — full redesign matching reference screenshot
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F8FAFC] pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Soft radial bg blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-2xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-50 rounded-full opacity-50 blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[520px]">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <motion.div initial="hidden" animate="visible" className="flex flex-col justify-center">

              {/* Trust indicator */}
              <motion.div variants={fadeUp(0)} className="flex items-center gap-3 mb-7">
                <div className="flex -space-x-2">
                  {avatarLetters.map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
                      style={{ backgroundColor: avatarColors[i], zIndex: 4 - i }}>
                      {l}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  <span className="text-[#5B5FF8] font-black">45k+</span> regular users
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 variants={fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-gray-900 leading-[1.13] mb-5 tracking-tight">
                Find Your{" "}
                <span className="text-[#5B5FF8]">Dream<br />Job</span>{" "}
                And Make Your<br />Goal
              </motion.h1>

              {/* Subtext */}
              <motion.p variants={fadeUp(0.2)} className="text-base text-gray-500 mb-8 max-w-md leading-relaxed">
                Connecting talent with opportunities worldwide. Start your journey to career success today.
              </motion.p>

              {/* Search bar */}
              <motion.form variants={fadeUp(0.3)} onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-2xl shadow-lg shadow-gray-200/70 border border-gray-100 p-1.5 mb-5 max-w-[520px]">
                <div className="flex items-center gap-2 px-4 py-2 flex-1 min-w-0">
                  <MapPin className="w-5 h-5 text-[#5B5FF8] shrink-0" />
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    type="text" placeholder="Location"
                    className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full" />
                  <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 flex-1 min-w-0">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input value={keyword} onChange={e => setKeyword(e.target.value)}
                    type="text" placeholder="Job title, keyword"
                    className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full" />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="bg-[#5B5FF8] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#4a4ee0] transition-colors whitespace-nowrap shadow-md shadow-indigo-200">
                  Find Job
                </motion.button>
              </motion.form>

              {/* Popular tags */}
              <motion.div variants={fadeUp(0.4)} className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400 font-semibold mr-1">Popular Search</span>
                {popularTags.map((tag) => (
                  <motion.button key={tag} onClick={() => handleTagSearch(tag)}
                    whileHover={{ scale: 1.05, backgroundColor: "#5B5FF8", color: "#fff" }}
                    transition={{ duration: 0.15 }}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 shadow-sm cursor-pointer transition-colors">
                    {tag}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN — cinematic slide-in from right ─────────── */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              animate="visible"
              className="relative flex items-center justify-center lg:justify-end h-[400px] lg:h-[500px]"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Soft animated circle bg */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] rounded-full bg-indigo-100/70" />
              </motion.div>

              {/* Hero image — scales in after panel settles */}
              <motion.img
                src={heroPng}
                alt="Professional with laptop"
                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 h-[340px] lg:h-[430px] object-contain drop-shadow-2xl"
                style={{ willChange: "transform, opacity" }}
              />

              {/* Floating brand icons — organic y-loop with varied speed */}
              {floatingIcons.map((icon) => (
                <motion.div
                  key={icon.alt}
                  className={`absolute z-20 ${icon.style}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, icon.delay % 2 === 0 ? -10 : -7, 0],
                  }}
                  transition={{
                    opacity: { delay: icon.delay + 0.6, duration: 0.45 },
                    scale: { delay: icon.delay + 0.6, duration: 0.45, ease: "backOut" },
                    y: {
                      delay: icon.delay + 1.0,
                      duration: 2.8 + icon.delay * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "mirror",
                    },
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg shadow-indigo-100/60 flex items-center justify-center border border-gray-100">
                    <img src={icon.src} alt={icon.alt} className="w-6 h-6 object-contain" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[["10k+","Active Jobs"],["500+","Companies"],["25k+","Daily Users"],["8k+","Hired"]].map(([val, lab], i) => (
              <Reveal key={lab} delay={i * 0.08}>
                <p className="text-3xl font-black text-gray-900 mb-0.5">{val}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{lab}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#5B5FF8] bg-indigo-50 rounded-full mb-3">Explore</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Find roles that match your skillset across every industry.</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.label} delay={i * 0.06} zoom>
                <motion.button
                  onClick={() => handleTagSearch(cat.label)}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  className={`group w-full flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:shadow-indigo-50 hover:border-indigo-100 ring-2 ring-transparent ${cat.ring} transition-colors duration-200 cursor-pointer`}
                  style={{ willChange: "transform" }}
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-[#5B5FF8] transition-colors">{cat.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex justify-between items-end mb-12">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#5B5FF8] bg-indigo-50 rounded-full mb-3">Opportunities</span>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-400 text-sm max-w-xl">Hand-picked opportunities from top companies.</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center text-[#5B5FF8] font-semibold hover:underline group text-sm">
              View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id:1, title:"Senior Frontend Developer", company:"TechCorp Inc.", location:"San Francisco, CA", type:"Full-time", salary:"$120k–$150k", badge:"Hot 🔥" },
              { id:2, title:"Product Designer", company:"Creative Studio", location:"Remote", type:"Contract", salary:"$80k–$100k", badge:"Remote" },
              { id:3, title:"Backend Engineer", company:"DataSystems", location:"New York, NY", type:"Full-time", salary:"$130k–$160k", badge:"Urgent" },
            ].map((job, i) => (
              <Reveal key={job.id} delay={i * 0.1}>
                <motion.div whileHover={{ y:-5, boxShadow:"0 24px 48px rgba(91,95,248,0.12)" }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-indigo-100 transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-[#5B5FF8] group-hover:bg-[#5B5FF8] group-hover:text-white transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-[#5B5FF8]">{job.badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full border border-gray-100">{job.location}</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full border border-gray-100">{job.type}</span>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">{job.salary}</span>
                  </div>
                  <Link to="/jobs" className="block w-full py-2.5 text-center text-sm bg-gray-50 text-gray-800 font-semibold rounded-xl hover:bg-[#5B5FF8] hover:text-white transition-all border border-gray-100">
                    Apply Now
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/jobs" className="inline-flex items-center text-[#5B5FF8] font-semibold text-sm">
              View all jobs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#5B5FF8] bg-indigo-50 rounded-full mb-3">Process</span>
            <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-400 text-sm">Three simple steps to land your next role.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-9 left-[20%] right-[20%] h-px bg-gray-200 -z-10" />
            {[
              { icon: User,     step:"01", title:"Create Account", desc:"Sign up for free and build your professional profile in minutes.",      color:"bg-indigo-50 text-[#5B5FF8]" },
              { icon: FileText, step:"02", title:"Upload Resume",  desc:"Upload your CV so recruiters can discover and match you with roles.",  color:"bg-purple-50 text-purple-600" },
              { icon: Send,     step:"03", title:"Apply for Jobs", desc:"Browse thousands of opportunities and apply with a single click.",    color:"bg-pink-50 text-pink-500" },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15} className="text-center flex flex-col items-center">
                <div className={`relative w-20 h-20 ${step.color} rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg`}>
                  <step.icon className="w-8 h-8" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#5B5FF8] text-white text-[10px] font-black rounded-full flex items-center justify-center">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#5B5FF8] bg-indigo-50 rounded-full mb-3">Success Stories</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">What Our Users Say</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Real experiences from job seekers who found their dream roles.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.12}>
                <motion.div whileHover={{ y:-4 }}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: t.color }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            className="bg-[#5B5FF8] rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl" />
            <h2 className="text-3xl sm:text-4xl font-black mb-4 relative z-10">Ready to Start Your Journey?</h2>
            <p className="text-indigo-100 text-base mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of professionals who have found their dream careers through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/register" className="px-8 py-4 bg-white text-[#5B5FF8] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg text-sm">
                Create Free Account
              </Link>
              <Link to="/register-company" className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all border border-indigo-600 text-sm">
                Post a Job
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGOS MARQUEE (untouched) ─────────────────────────────────────── */}
      <LogosMarquee />
    </div>
  );
};

export default Home;
