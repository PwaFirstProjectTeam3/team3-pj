// src/configs/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://openapi.seoul.go.kr:8088",
  timeout: 10000,
}); 

export default axiosClient;