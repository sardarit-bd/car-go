import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // CRITICAL: Allows sending httpOnly cookies cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

// NEW: Request interceptor to attach Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global interceptor to handle 401 Unauthorized (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // NEW: Clear token on 401
        // localStorage.removeItem("cargo_admin");
        // Optional: Automatically redirect to login page
        // window.location.href = "/account/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
