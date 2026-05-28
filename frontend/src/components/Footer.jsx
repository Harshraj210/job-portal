import { Link } from "react-router-dom";
import { Mail, Github, Linkedin, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import ContactModal from "./ContactModal";

const Footer = () => {
  const { user } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const socialIconVariants = {
    hover: { scale: 1.15, rotate: 2, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };

  return (
    <footer className="bg-white border-t border-gray-100 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* ── LEFT BRAND SECTION (Takes 4 columns on desktop) ── */}
          <motion.div variants={itemVariants} className="lg:col-span-4 lg:pr-8 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 group mb-5">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-9 h-9 bg-gradient-to-br from-[#7315c7] to-[#9333ea] rounded-xl flex items-center justify-center shadow-lg shadow-[#7315c7]/20"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-2xl text-gray-900 tracking-tight">
                Hire<span className="text-[#7315c7]">Nova</span>
              </span>
            </Link>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Connecting talent with opportunity. Helping candidates discover careers and employers find the right people.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <motion.a 
                href="https://www.linkedin.com/in/harsh-raj-25425a334/" 
                target="_blank" 
                rel="noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
                className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#7315c7] hover:border-[#7315c7] hover:shadow-lg hover:shadow-[#7315c7]/30 transition-all"
              >
                <Linkedin size={18} className="fill-current" />
              </motion.a>
              <motion.a 
                href="https://github.com/Harshraj210" 
                target="_blank" 
                rel="noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
                className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-lg transition-all"
              >
                <Github size={18} className="fill-current" />
              </motion.a>
              <motion.a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nh1750501@gmail.com"
                target="_blank"
                rel="noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
                className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#7315c7] hover:bg-purple-50 hover:border-purple-200 transition-all"
              >
                <Mail size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* ── FOOTER LINKS (Takes remaining 8 columns) ── */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Section 1: For Candidates */}
            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-bold text-gray-900 text-sm mb-5 tracking-wide">For Candidates</h3>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li>
                  <Link to="/jobs" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Browse Jobs
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Browse Companies
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
                
                {/* Authenticated Links */}
                {user && (
                  <>
                    {user.role === 'applicant' && (
                      <li>
                        <Link to="/saved-jobs" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                          Saved Jobs
                          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/profile" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                        Profile
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                      </Link>
                    </li>
                    {user.role === 'applicant' && (
                      <li>
                        <Link to="/notifications" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                          Notifications
                          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </motion.div>

            {/* Section 2: Company */}
            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-bold text-gray-900 text-sm mb-5 tracking-wide">Company</h3>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li>
                  <Link to="/about" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    About Us
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
                <li>
                  <button onClick={() => setIsContactModalOpen(true)} className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Section 3: Support */}
            <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1 flex flex-col items-center md:items-start text-center md:text-left mt-4 sm:mt-0">
              <h3 className="font-bold text-gray-900 text-sm mb-5 tracking-wide">Support</h3>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li>
                  <Link to="/help" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Help Center
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Privacy Policy
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#7315c7] transition-colors relative group inline-block">
                    Terms of Service
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7315c7] rounded-full transition-all group-hover:w-full opacity-50"></span>
                  </Link>
                </li>
              </ul>
            </motion.div>

          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400"
        >
          <p>
            © {currentYear} HireNova Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Use</Link>
          </div>
        </motion.div>
      </motion.div>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </footer>
  );
};

export default Footer;
