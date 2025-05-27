"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/reset-password/${token}`, { password });
      toast.success("Password berhasil direset! Silakan login.");
      router.push("/auth/login");
    } catch {
      toast.error("Reset password gagal.");
    }
  };

  return (
    <main className="min-h-screen flex justify-center pt-28 pb-4 bg-gradient-to-br from-sky-100 via-white to-gray-50">
      <section className="w-full max-w-sm md:max-w-md bg-white border rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
          Reset Password
        </h1>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn btn-primary w-full">
            Reset Password
          </button>
        </form>
      </section>
    </main>
  );
}
