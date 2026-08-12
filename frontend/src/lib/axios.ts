import axios from "axios";
import { API_BASE_URL } from "./constants";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log("========================================");
    console.log("🚀 API REQUEST");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", config.url);
    console.log("Params:", config.params);
    console.log("Data:", config.data);
    console.log("========================================");
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("========================================");
    console.log("✅ API RESPONSE");
    console.log("Endpoint:", response.config.url);
    console.log(response.data);
    console.log("========================================");
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    console.error("❌ API ERROR:", error.config?.url, error.response?.data || error.message);
    return Promise.reject(error);
  }
);
