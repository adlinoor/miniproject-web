import axios from "axios";
import { getCookie } from "cookies-next";

// ✅ Konfigurasi dasar axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  withCredentials: true,
});

// ✅ Tambah Authorization token otomatis
api.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
