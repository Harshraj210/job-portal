import { useAuth } from "../context/AuthContext";

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <p className="text-gray-600 mb-8">
          Welcome back, <span className="font-bold text-blue-600">{user?.name}</span>! Manage your job postings and applications here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Post a Job */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-bold text-xl text-blue-700 mb-2">Post a New Job</h3>
            <p className="text-sm text-gray-600">Create a listing to find the perfect candidate for your open roles.</p>
          </div>

          {/* Card 2: Manage Applications */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-100 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="font-bold text-xl text-green-700 mb-2">View Applications</h3>
            <p className="text-sm text-gray-600">Review resumes and manage the status of your applicants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;