import api from "@/lib/api-client";

const authService = {
  // ✅ Login
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // ✅ Register
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    referralCode?: string;
  }) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // ✅ Forgot Password
  async forgotPassword(email: string) {
    return await api.post("/auth/forgot-password", { email });
  },

  // ✅ Reset Password (opsional)
  async resetPassword(token: string, newPassword: string) {
    return await api.post(`/auth/reset-password`, {
      token,
      newPassword,
    });
  },

  // ✅ Get profile (bisa dipakai auto-login)
  async getProfile() {
    return await api.get("/auth/profile");
  },
};

export default authService;
