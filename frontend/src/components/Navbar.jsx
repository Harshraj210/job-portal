import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Briefcase, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7315c7] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
                J
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Job<span className="text-[#7315c7]">Portal</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors">
              Companies
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-[#7315c7]">
                    <User className="w-4 h-4" />
                  </div>
                  {user.name}
                </span>
                {user.role === "recruiter" && (
                  <Link
                    to="/recruiter-dashboard"
                    className="bg-purple-50 text-[#7315c7] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-[#7315c7] font-medium px-3 py-2 rounded-lg hover:bg-purple-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#7315c7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#9324bc] shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all transform active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#7315c7] focus:outline-none p-2 rounded-md hover:bg-purple-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7315c7] hover:bg-purple-50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7315c7] hover:bg-purple-50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Find Jobs
            </Link>
            
            {user ? (
              <>
                <div className="px-3 py-3 mt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Signed in as</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                {user.role === "recruiter" && (
                  <Link
                    to="/recruiter-dashboard"
                    className="block px-3 py-3 rounded-md text-base font-medium text-[#7315c7] bg-purple-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-3 px-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-3 bg-[#7315c7] text-white rounded-xl font-bold shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;