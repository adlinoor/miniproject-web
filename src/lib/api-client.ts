import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // wajib agar cookie dikirim
});

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = getCookie("access_token");
    console.log("✅ Interceptor: access_token =", token); // debug
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default api;
