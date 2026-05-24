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
  Shield, Zap, Globe, CheckCircle2, Bell, Check,
} from "lucide-react";
import heroPng from "../assets/hero-professional.png";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } },
});

const slideFromRight = {
  hidden: { opacity: 0, x: 72, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
});

// ── Avatar trust indicator ────────────────────────────────────────────────────
const avatarColors = ["#7315c7", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
const avatarImages = [
  "https://i.pravatar.cc/150?img=32",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=45",
  "https://i.pravatar.cc/150?img=68",
];

// ── Popular search tags ───────────────────────────────────────────────────────
const popularTags = ["Data Management", "Marketing Manager", "Customer Support"];

// ── Job categories ────────────────────────────────────────────────────────────
const categories = [
  { icon: Code2,      label: "Development & IT",   desc: "Frontend, backend, web and app developer jobs.", count: "16 jobs", color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { icon: Megaphone,  label: "Marketing & Sales",  desc: "Advertising, digital marketing and brand strategy.", count: "8 jobs",  color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { icon: Palette,    label: "Design & Creative",  desc: "Graphic, digital, web, and product design jobs.", count: "13 jobs", color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { icon: User,       label: "Customer Service",   desc: "Customer experience and account management.", count: "8 jobs",  color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { icon: Briefcase,  label: "Product & Business", desc: "Product management and business development.", count: "5 jobs",  color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { icon: Database,   label: "Data Science",       desc: "Data analysis, machine learning and engineering.", count: "10 jobs", color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Ananya Sharma",   role: "Frontend Developer at Tvara",      text: "Found my dream job within 2 weeks. The search filters are incredibly powerful and the apply process is frictionless.",  color: "#7315c7" },
  { name: "Rohan Mehta",     role: "Product Designer at Zryth Solutions", text: "HireNova's platform feels like it was built by people who actually understand what job seekers need. Absolutely seamless.", color: "#10b981" },
  { name: "Meera Patel",     role: "Data Analyst at Concurrence AI",    text: "I got three interview calls in my first week. The category filtering and company profiles are top-notch.",             color: "#f59e0b" },
];

// ── Scroll-reveal wrapper ─────────────
const Reveal = ({ children, delay = 0, className = "", zoom = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const initial = zoom
    ? { opacity: 0, scale: 0.95, y: 12 }
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
  <div className="py-12 bg-transparent overflow-hidden">
    <p className="text-left text-xs font-semibold text-gray-500 mb-8 uppercase tracking-widest max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      Trusted by leading brands and startups
    </p>
    <div className="relative flex overflow-x-hidden opacity-80 hover:opacity-100 transition-opacity">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center px-8 shrink-0 transition-all">
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
  // APPLICANT VIEW — Clean SaaS Redesign
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[520px]">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <motion.div initial="hidden" animate="visible" className="flex flex-col justify-center">

              {/* Heading */}
              <motion.h1 variants={fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-[#111827] leading-[1.1] mb-6 tracking-tight">
                Got Talent ?<br />
                Meet Opportunity
              </motion.h1>

              {/* Subtext */}
              <motion.p variants={fadeUp(0.2)} className="text-lg text-[#6B7280] mb-10 max-w-lg leading-relaxed">
                Company reviews. Salaries. Interviews. Jobs.
              </motion.p>

              {/* Search bar */}
              <motion.form variants={fadeUp(0.3)} onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-full shadow-sm shadow-gray-200 border border-gray-200 p-2 mb-8 max-w-[600px] w-full">
                
                <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input value={keyword} onChange={e => setKeyword(e.target.value)}
                    type="text" placeholder="Job title or keywords"
                    className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-400 w-full" />
                </div>
                
                <div className="hidden sm:block w-px h-8 bg-gray-200 my-auto" />
                
                <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    type="text" placeholder="All Location"
                    className="bg-transparent outline-none text-base text-gray-700 placeholder-gray-400 w-full" />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="bg-[#10b981] text-white font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#059669] transition-colors whitespace-nowrap shadow-md">
                  Search
                </motion.button>
              </motion.form>

              {/* Popular tags */}
              <motion.div variants={fadeUp(0.4)} className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 font-medium mr-1">Popular Searches:</span>
                {popularTags.map((tag) => (
                  <button key={tag} onClick={() => handleTagSearch(tag)}
                    className="text-sm text-gray-700 font-medium hover:text-[#10b981] transition-colors cursor-pointer">
                    {tag}{tag !== popularTags[popularTags.length - 1] && ","}
                  </button>
                ))}
              </motion.div>

              <div className="mt-16">
                 <LogosMarquee />
              </div>
            </motion.div>

            {/* ── RIGHT COLUMN — cinematic slide-in from right ─────────── */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              animate="visible"
              className="relative flex items-center justify-center h-[500px] lg:h-[600px]"
            >
              {/* Soft abstract circle bg (matching image) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] lg:w-[480px] lg:h-[480px] rounded-full bg-[#fce7f3] opacity-50 z-0" />

              {/* Hero image */}
              <img
                src={heroPng}
                alt="Professional"
                className="relative z-10 h-[450px] lg:h-[550px] object-contain drop-shadow-2xl"
              />

              {/* Floating Card 1: Job Alert */}
              <motion.div
                className="absolute top-[25%] left-0 z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Job Alert Subscribe</span>
                </div>
              </motion.div>

              {/* Floating Card 2: Candidates Hired */}
              <motion.div
                className="absolute bottom-[20%] right-0 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex flex-col gap-2 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500">5k+ candidates get job</span>
                  <div className="flex items-center justify-between">
                     <div className="flex -space-x-2">
                       {avatarImages.map((src, i) => (
                         <img key={i} src={src} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                       ))}
                     </div>
                     <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white ml-2 shadow-sm">
                       <Check className="w-4 h-4 text-white" />
                     </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DUAL ACTION CARDS ────────────────────────────────────────────── */}
      <section className="pb-20 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employer Card */}
            <Reveal delay={0}>
              <div className="bg-[#fee2e2]/40 rounded-3xl p-8 lg:p-12 flex items-center justify-between relative overflow-hidden transition-all hover:bg-[#fee2e2]/60 border border-transparent hover:border-red-100">
                <div className="relative z-10 max-w-[200px] sm:max-w-[260px]">
                  <h2 className="text-2xl font-bold text-[#111827] mb-3">For Employers</h2>
                  <p className="text-sm text-[#6B7280] mb-8 font-medium leading-relaxed">
                    Find professionals from around the world and across all skills.
                  </p>
                  <Link to="/register-company" className="inline-block bg-[#10b981] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#059669] transition-colors shadow-sm">
                    Post jobs for Free
                  </Link>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-end pointer-events-none opacity-80 mix-blend-multiply">
                   {/* Abstract illustration placeholder (using Lucide icon for simplicity) */}
                   <div className="w-40 h-40 bg-red-100 rounded-full translate-x-8 translate-y-8 flex items-center justify-center">
                      <Building2 className="w-20 h-20 text-red-300" />
                   </div>
                </div>
              </div>
            </Reveal>

            {/* Candidate Card */}
            <Reveal delay={0.2}>
              <div className="bg-[#ffedd5]/50 rounded-3xl p-8 lg:p-12 flex items-center justify-between relative overflow-hidden transition-all hover:bg-[#ffedd5]/70 border border-transparent hover:border-orange-100">
                <div className="relative z-10 max-w-[200px] sm:max-w-[260px]">
                  <h2 className="text-2xl font-bold text-[#111827] mb-3">For Candidate</h2>
                  <p className="text-sm text-[#6B7280] mb-8 font-medium leading-relaxed">
                    Build your professional profile, find new job opportunities.
                  </p>
                  <Link to="/profile" className="inline-block bg-[#10b981] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#059669] transition-colors shadow-sm">
                    Upload your CV
                  </Link>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-end justify-end pointer-events-none opacity-80 mix-blend-multiply">
                   <div className="w-40 h-40 bg-orange-100 rounded-full translate-x-8 translate-y-8 flex items-center justify-center">
                      <User className="w-20 h-20 text-orange-300" />
                   </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#111827] mb-2">Popular category</h2>
              <p className="text-[#6B7280] text-sm">2020 jobs live – 293 added today.</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center text-[#10b981] font-semibold hover:underline text-sm border-b-2 border-transparent hover:border-[#10b981] pb-1 transition-all">
              View all categories
            </Link>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Reveal key={cat.label} delay={i * 0.05} zoom>
                <motion.button
                  onClick={() => handleTagSearch(cat.label)}
                  whileHover={{ y: -4 }}
                  className="w-full flex flex-col items-start p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-white hover:border-[#10b981]/30 hover:shadow-lg hover:shadow-[#10b981]/5 transition-all duration-300 text-left group"
                >
                  <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-1">{cat.label}</h3>
                  <p className="text-sm font-medium text-[#10b981] mb-2">{cat.count}</p>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{cat.desc}</p>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS (Restyled) ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-2">Featured Jobs</h2>
            <p className="text-[#6B7280] text-sm">Hand-picked opportunities from top companies.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id:1, title:"Senior Frontend Developer", company:"TechCorp Inc.", location:"San Francisco, CA", type:"Full-time", salary:"$120k–$150k", badge:"Hot 🔥" },
              { id:2, title:"Product Designer", company:"Creative Studio", location:"Remote", type:"Contract", salary:"$80k–$100k", badge:"Remote" },
              { id:3, title:"Backend Engineer", company:"DataSystems", location:"New York, NY", type:"Full-time", salary:"$130k–$160k", badge:"Urgent" },
            ].map((job, i) => (
              <Reveal key={job.id} delay={i * 0.1}>
                <motion.div whileHover={{ y:-4 }}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#7315c7]/20 hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#111827] border border-gray-200">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-[#111827]">{job.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-1">{job.title}</h3>
                  <p className="text-sm text-[#6B7280] mb-5">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    <span className="px-3 py-1 bg-white text-gray-600 text-xs font-semibold rounded-md border border-gray-200">{job.location}</span>
                    <span className="px-3 py-1 bg-white text-gray-600 text-xs font-semibold rounded-md border border-gray-200">{job.type}</span>
                  </div>
                  <Link to="/jobs" className="block w-full py-3 text-center text-sm bg-white text-[#111827] font-bold rounded-xl hover:bg-[#111827] hover:text-white transition-all border border-gray-200 hover:border-[#111827]">
                    Apply Now
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Restyled) ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-2">What Our Users Say</h2>
            <p className="text-[#6B7280] text-sm">Real experiences from job seekers who found their dream roles.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.12}>
                <motion.div whileHover={{ y:-4 }}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#111827] font-medium leading-relaxed mb-8 flex-grow">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: t.color }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">{t.name}</p>
                      <p className="text-xs text-[#6B7280]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
