// src/configs/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://openapi.seoul.go.kr:8088",
  timeout: 10000,
}); 

export default axiosClient;