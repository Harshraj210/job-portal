import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 text-center">
      
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
        Find Your <span className="text-blue-600">Dream Job</span> Today
      </h1>
      
      {/* Subheading */}
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
        Connect with top companies and startups. Whether you're hiring or looking for work, we've got you covered with thousands of opportunities.
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
        
        {/* Login Button */}
        <Link 
          to="/login" 
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm sm:text-base flex items-center justify-center"
        >
          Login
        </Link>
        
        {/* Register Button */}
        <Link 
          to="/register" 
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm sm:text-base flex items-center justify-center"
        >
          Job Seeker Sign Up
        </Link>
        
        {/* Post Job Button */}
        <Link 
          to="/register-company" 
          className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 text-sm sm:text-base flex items-center justify-center"
        >
          Post a Job
        </Link>
      </div>

      {/* Optional: Trust Badge or Stats (Responsive Grid) */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60">
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">10k+</p>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Active Jobs</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">500+</p>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Companies</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-3xl font-bold text-gray-800">24h</p>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Support</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-3xl font-bold text-gray-800">100%</p>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Secure</p>
        </div>
      </div>

    </div>
  );
};

export default Home;