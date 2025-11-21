import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import RecruiterRegister from "./pages/RecruiterRegister";
import RecruiterDashboard from "./pages/RecruiterDashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <Routes>
         <Route path="/" element={<Home />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
              <Route path="/register-company" element={<RecruiterRegister />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
