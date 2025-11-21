import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7315c7] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                J
              </div>
              <span className="font-bold text-xl text-gray-900">
                Job<span className="text-[#7315c7]">Portal</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting talent with opportunity. The easiest way to find your next dream job or perfect candidate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Candidates</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/jobs" className="hover:text-[#7315c7] transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-[#7315c7] transition-colors">Browse Companies</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#7315c7] transition-colors">Candidate Dashboard</Link></li>
              <li><Link to="/saved-jobs" className="hover:text-[#7315c7] transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Employers</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/register-company" className="hover:text-[#7315c7] transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-[#7315c7] transition-colors">Pricing Plans</Link></li>
              <li><Link to="/recruiter-dashboard" className="hover:text-[#7315c7] transition-colors">Recruiter Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-[#7315c7] transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-[#7315c7] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-[#7315c7] transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Mail className="w-4 h-4 text-[#7315c7]" />
                <span>support@jobportal.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 JobPortal Inc. All rights reserved.</p>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-[#7315c7] transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#7315c7] transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#7315c7] transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-[#7315c7] transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;