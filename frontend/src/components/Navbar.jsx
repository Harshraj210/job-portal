import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, User, LogOut, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";

const NavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-[#7315c7]" : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7315c7] rounded-full"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const navLinks = user ? [
    { label: "Home", href: "/" },
    { label: "Find Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "About us", href: "/about" },
  ] : [];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-sm border-b border-gray-200/50 py-2"
            : "bg-white border-b border-gray-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50 group" onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-8 h-8 bg-gradient-to-br from-[#7315c7] to-[#9333ea] rounded-xl flex items-center justify-center shadow-lg shadow-[#7315c7]/30"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:opacity-80 transition-opacity">
                Hire<span className="text-[#7315c7]">Nova</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  isActive={location.pathname === link.href}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-5 pl-5 border-l border-gray-200">
                  <NotificationDropdown />

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                      <User className="w-4 h-4 text-[#7315c7]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize font-medium">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={user.role === "recruiter" ? "/recruiter-dashboard" : "/profile"}
                      className="text-sm font-medium text-gray-600 hover:text-[#7315c7] transition-colors"
                    >
                      {user.role === "recruiter" ? "Dashboard" : "Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-[#7315c7] rounded-lg hover:bg-[#5e11a3] hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7315c7]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden z-50">
              {user && <NotificationDropdown />}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden border-l border-gray-100"
            >
              <div className="p-6 flex-1 overflow-y-auto mt-16">
                {user && (
                  <div className="mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center border border-purple-200">
                        <User className="w-5 h-5 text-[#7315c7]" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs font-medium text-[#7315c7] uppercase tracking-wider">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={user.role === "recruiter" ? "/recruiter-dashboard" : "/profile"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 text-sm font-medium transition-colors group"
                      >
                        {user.role === "recruiter" ? "Dashboard" : "My Profile"}
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7315c7] transition-colors" />
                      </Link>
                      {user.role === "applicant" && (
                        <Link
                          to="/saved-jobs"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 text-sm font-medium transition-colors group"
                        >
                          Saved Jobs
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7315c7] transition-colors" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Menu
                  </p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                        location.pathname === link.href
                          ? "bg-purple-50 text-[#7315c7]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-red-600 font-medium hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 text-center text-gray-700 font-semibold bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 text-center text-white font-semibold bg-[#7315c7] rounded-xl shadow-md shadow-purple-200 hover:bg-[#5e11a3] transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
