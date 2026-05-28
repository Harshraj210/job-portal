import axios from "axios";

// VITE_API_URL is set via:
//   - Vercel: Environment Variables in the Vercel dashboard → VITE_API_URL = https://job-portal-backend-3l3e.onrender.com/api
//   - Local dev: frontend/.env.local → VITE_API_URL = http://localhost:3000/api
//   - If unset, falls back to the Render backend (safe for production)
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://job-portal-backend-3l3e.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies cross-origin
  timeout: 30000,        // 30s timeout — Render free tier cold-starts take ~30s
});

// ── Request interceptor ────────────────────────────────────────────────────
// Attach Bearer token on EVERY request.
// This is the PRIMARY auth mechanism for cross-origin (Vercel → Render) because
// sameSite:'none' cookies require HTTPS on both ends AND correct CORS headers —
// Bearer tokens in the Authorization header are more reliable across environments.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
// Log 401s with full URL so you can see exactly which endpoint is failing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "[API 401] Unauthorized on:",
        error.config?.method?.toUpperCase(),
        error.config?.url,
        "| token present:", !!localStorage.getItem("token")
      );
      // Automatically clear session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Avoid redirecting if already on login or register pages
      if (typeof window !== "undefined" && !window.location.pathname.match(/^\/(login|register)/)) {
          window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

