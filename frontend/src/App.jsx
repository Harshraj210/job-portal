import { Routes, Route, useLocation } from "react-router-dom";
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
import MyApplications from "./pages/MyApplications";
import Notifications from "./pages/Notifications";
import RecruiterInterviews from "./pages/RecruiterInterviews";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Routes where the global Navbar and Footer should be hidden so the
// full-screen auth pages can render without chrome on top.
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/recruiter-register"];

function App() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      {/* Navbar — hidden on full-screen auth pages */}
      {!isAuthPage && <Navbar />}

      {/* Main Content */}
      <main className={`flex-grow w-full ${!isAuthPage ? "max-w-7xl mx-auto px-4" : ""}`}>
        <Routes>
          {/* ── AUTH PAGES (full-screen, no layout chrome) ── */}
          {/* PublicOnlyRoute redirects already-logged-in users away */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />

          {/* ── PUBLIC PAGES (accessible without login) ── */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/about" element={<About />} />

          {/* ── PROTECTED PAGES (require login) ── */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute>
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />

          {/* ── RECRUITER-ONLY PAGES (require login + recruiter role + company) ── */}
          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <RecruiterDashboard />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-company"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <RegisterCompany />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard/post-job"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <PostJob />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard/manage-jobs"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <ManageJobs />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard/applications"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <ViewApplications />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-applicants/:jobId"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <JobApplicants />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter-dashboard/interviews"
            element={
              <ProtectedRoute>
                <RecruiterGuard>
                  <RecruiterInterviews />
                </RecruiterGuard>
              </ProtectedRoute>
            }
          />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer — hidden on full-screen auth pages */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
