import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AuthModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show if the user hasn't dismissed it this session
    const hasDismissed = sessionStorage.getItem("authModalDismissed");
    
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500); // Wait 2.5 seconds before popping up

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("authModalDismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0f0a1e]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Gradient Header */}
            <div className="h-32 bg-gradient-to-br from-purple-100 via-purple-50 to-white relative overflow-hidden flex items-center justify-center">
               {/* Decorative blobs */}
               <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl"></div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#7315c7]/10 rounded-full blur-2xl"></div>
               
               <div className="w-16 h-16 bg-gradient-to-br from-[#7315c7] to-[#9333ea] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7315c7]/30 transform rotate-[-5deg]">
                  <Sparkles className="w-8 h-8 text-white" />
               </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-6 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
                Unlock HireNova
              </h2>
              <p className="text-sm text-gray-500 mb-8 px-2 leading-relaxed">
                Join Hire Nova to explore jobs, apply instantly, and manage your professional profile.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#7315c7] to-[#8e24e0] rounded-xl hover:shadow-lg hover:shadow-[#7315c7]/25 transition-all group"
                >
                  Create free account
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full py-3.5 px-4 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Log In
                </Link>
              </div>

              <p className="mt-6 text-xs text-gray-400">
                It only takes a few seconds to get started.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
