import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, User, LogOut, Briefcase } from "lucide-react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // --- GSAP ANIMATION REFS & LOGIC ---
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const mobileNavItems = [
    {
      label: "Navigation",
      bgColor: "#f3e8ff",
      textColor: "#4c1d95",
      links: [
        { label: "Home", href: "/" },
        { label: "Find Jobs", href: "/jobs" },
        { label: "Companies", href: "/companies" },
        { label: "About Us", href: "/about" },
      ],
    },
  ];

  if (user) {
    mobileNavItems.push({
      label: `Profile (${user.name})`,
      bgColor: "#7315c7",
      textColor: "#fff",
      links: [
        ...(user.role === "recruiter"
          ? [{ label: "Recruiter Dashboard", href: "/recruiter-dashboard" }]
          : [
              { label: "My Applications", href: "/applications" },
              { label: "Saved Jobs", href: "/saved-jobs" },
            ]),
      ],
    });
  } else {
    mobileNavItems.push({
      label: "Get Started",
      bgColor: "#1f2937", // Dark gray
      textColor: "#fff",
      links: [
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/register" },
        { label: "Post a Job", href: "/register-company" },
      ],
    });
  }

  // --- GSAP ANIMATION SETUP ---
  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    // Initial Set: Hidden and height 0
    gsap.set(navEl, { height: 0, opacity: 0, display: "none" });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      display: "block",
      duration: 0,
    })
      .to(navEl, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      })
      .fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.08 },
        "-=0.2"
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (tlRef.current) {
      if (isOpen) {
        tlRef.current.play();
      } else {
        tlRef.current.reverse();
      }
    }
  }, [isOpen]);

  // Helper to set refs for cards
  const setCardRef = (el, index) => {
    if (el) cardsRef.current[index] = el;
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* --- LOGO --- */}
            <div className="flex items-center z-50">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-[#7315c7] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
                  J
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  Job<span className="text-[#7315c7]">Portal</span>
                </span>
              </Link>
            </div>

            {/* --- DESKTOP MENU --- */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors"
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors"
              >
                Companies
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-[#7315c7] font-medium transition-colors"
              >
                About us
              </Link>

              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  {/* Notification Dropdown */}
                  <NotificationDropdown />
                  
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-[#7315c7]">
                      <User className="w-4 h-4" />
                    </div>
                    {user.name}
                  </span>
                  <Link
                    to="/profile"
                    className="text-sm text-[#7315c7] font-semibold hover:underline"
                  >
                    My Profile
                  </Link>
                  {user.role === "applicant" && (
                    <Link
                      to="/saved-jobs"
                      className="text-sm text-[#7315c7] font-semibold hover:underline"
                    >
                      Saved Jobs
                    </Link>
                  )}

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
                    className="bg-[#7315c7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#9324bc] shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON --- */}
            <div className="flex items-center md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-[#7315c7] p-2 rounded-md hover:bg-purple-50 transition-colors"
              >
                {isOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- ANIMATED MOBILE MENU (Integrated Here) --- */}
        <div className="absolute left-0 right-0 z-40 w-full px-4 md:hidden top-[64px]">
          <nav
            ref={navRef}
            className="block w-full bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3 card-nav-content">
              {mobileNavItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl"
                  ref={(el) => setCardRef(el, idx)}
                  style={{
                    backgroundColor: item.bgColor,
                    color: item.textColor,
                  }}
                >
                  <div className="text-lg font-bold mb-3 border-b border-white/20 pb-2">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-3">
                    {item.links.map((lnk, i) => (
                      <Link
                        key={i}
                        to={lnk.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <span className="font-medium group-hover:underline underline-offset-2">
                          {lnk.label}
                        </span>
                        <GoArrowUpRight className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}

                    {/* Special Logout Button logic for the Profile card */}
                    {user && item.label.includes("Profile") && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-between group cursor-pointer text-left w-full mt-2 pt-2 border-t border-white/20"
                      >
                        <span className="font-medium group-hover:underline underline-offset-2">
                          Logout
                        </span>
                        <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </nav>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
