//  import axios from "axios";

//  const api = axios.create({
//    baseURL: "http://localhost:5000/api",
//     withCredentials: true,
  
//  });
//  api.interceptors.request.use((config) => {
//    const token = localStorage.getItem("token");
//    if (token) {
//      config.headers.Authorization = `Bearer ${token}`;
//    }
//    return config;
//  });


//  export default api;
import axios from "axios";

// Use VITE_API_URL env var if set, otherwise fall back to the deployed backend.
// For local dev: create frontend/.env.local with VITE_API_URL=http://localhost:3000/api
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://job-portal-backend-3l3e.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies cross-origin
  timeout: 30000, // 30-second timeout (Render cold starts can be slow)
});

// Attach Bearer token on every request so auth works even when cookies
// are blocked cross-origin (common in local dev vs deployed backend).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log 401 errors to make debugging easier
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("API 401 Unauthorized:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;
