import axios from "axios";
import { API_BASE_URL } from "./constants";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Render services can take longer than 8 seconds to wake from an idle state.
  timeout: 30000,
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
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    const endpoint = error.config?.url || "unknown endpoint";
    const detail = error.response?.data?.message || error.message || "Request failed";
    console.error(`API request failed (${endpoint}): ${detail}`);
    return Promise.reject(error);
  }
);
