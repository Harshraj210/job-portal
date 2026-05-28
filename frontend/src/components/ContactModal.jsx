import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";

const ContactCard = ({ icon: Icon, title, desc, href, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#7315c7]/30 hover:shadow-lg hover:shadow-[#7315c7]/10 transition-all group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 group-hover:text-[#7315c7] group-hover:border-[#7315c7]/30 group-hover:bg-purple-50 transition-colors">
      <Icon size={22} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-[#7315c7] transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 font-medium">{desc}</p>
    </div>
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent group-hover:bg-[#7315c7] transition-colors">
      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
    </div>
  </motion.a>
);

const ContactModal = ({ isOpen, onClose }) => {
  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f0a1e]/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header Area */}
            <div className="pt-8 px-8 pb-6 text-center relative overflow-hidden">
               {/* Decorative glow */}
               <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#7315c7]/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
               
               <button
                 onClick={onClose}
                 className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10"
               >
                 <X size={18} />
               </button>

               <div className="relative z-10">
                 <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Connect With Me</h2>
                 <p className="text-sm text-gray-500 font-medium px-4">
                   Choose your preferred platform to connect with Hire Nova.
                 </p>
               </div>
            </div>

            {/* Contact Options */}
            <div className="px-6 pb-8 space-y-3">
              <ContactCard
                icon={Linkedin}
                title="LinkedIn"
                desc="Connect professionally"
                href="https://www.linkedin.com/in/harsh-raj-25425a334/"
                delay={0.1}
              />
              <ContactCard
                icon={Github}
                title="GitHub"
                desc="View projects and repositories"
                href="https://github.com/Harshraj210"
                delay={0.2}
              />
              <ContactCard
                icon={Mail}
                title="Email"
                desc="Send a direct email"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nh1750501@gmail.com"
                delay={0.3}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
