import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import RecruiterRegister from "./pages/RecruiterRegister";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ManageJobs from "./pages/ManageJobs";
import JobApplicants from "./pages/JobApplicants";
import ViewApplications from "./pages/ViewApplications";
import SavedJobs from "./pages/SavedJobs";
import EditJob from "./pages/EditJob";
import RecruiterGuard from "./components/RecruiterGuard";
import RegisterCompany from "./pages/RegisterCompany";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      {/* Navbar always visible */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/companies" element={<Companies />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Jobs */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/edit-job/:id" element={<EditJob />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Recruiter (PROTECTED) */}
          <Route
            path="/recruiter-dashboard"
            element={
              <RecruiterGuard>
                <RecruiterDashboard />
              </RecruiterGuard>
            }
          />
          <Route
            path="/register-company"
            element={
              <RecruiterGuard>
                <RegisterCompany />
              </RecruiterGuard>
            }
          />

          <Route
            path="/recruiter-dashboard/post-job"
            element={
              <RecruiterGuard>
                <PostJob />
              </RecruiterGuard>
            }
          />

          <Route
            path="/recruiter-dashboard/manage-jobs"
            element={
              <RecruiterGuard>
                <ManageJobs />
              </RecruiterGuard>
            }
          />

          <Route
            path="/recruiter-dashboard/applications"
            element={
              <RecruiterGuard>
                <ViewApplications />
              </RecruiterGuard>
            }
          />

          <Route
            path="/job-applicants/:jobId"
            element={
              <RecruiterGuard>
                <JobApplicants />
              </RecruiterGuard>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}

export default App;
