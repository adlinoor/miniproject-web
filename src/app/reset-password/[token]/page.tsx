"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (!token || typeof token !== "string") {
      setValid(false);
      toast.error("Token tidak ditemukan atau tidak valid.");
      router.replace("/auth/forgot-password");
    }
  }, [token, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/reset-password/${token}`, { password });
      toast.success("Password berhasil direset! Silakan login.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Gagal reset password. Coba lagi."
      );
    }
  };

  if (!valid) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-gray-50 px-4">
      <section className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in-up space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </section>
    </main>
  );
}
