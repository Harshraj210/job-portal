import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ComingSoon = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-[#7315c7]" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We are currently working hard to bring this page to life. Please check back later!
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#7315c7] hover:bg-[#6011a6] text-white px-6 py-3 rounded-full font-medium transition-colors shadow-sm shadow-[#7315c7]/20"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
