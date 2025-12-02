import axios from "axios";
import { getToken } from "../utils/storage";
const axiosInstance = axios.create({
  baseURL: "http://192.168.1.76:8001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token dynamically before each request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken("access");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token added to headers");
  }
  return config;
});

export default axiosInstance;


