import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Find Your <span className="text-blue-600">Dream Job</span> Today
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Connect with top companies and startups. Whether you're hiring or looking for work, we've got you covered.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
        >
          Job Seeker Sign Up
        </Link>
        <Link 
          to="/register-company" 
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all shadow-lg"
        >
          Post a Job
        </Link>
      </div>
    </div>
  );
};

export default Home;