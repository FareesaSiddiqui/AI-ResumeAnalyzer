// src/utils/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000/api", // backend URL
  baseURL: "https://ai-resumeanalyzer-backend.onrender.com",  // ✅ dynamic backend URL
  withCredentials: true, // needed for sending HttpOnly cookies
});

export default axiosInstance;
