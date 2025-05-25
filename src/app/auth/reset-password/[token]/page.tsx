"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/users/reset-password/${token}`, { password });
      toast.success("Password berhasil direset! Silakan login.");
      router.push("/auth/login");
    } catch {
      toast.error("Reset password gagal.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
