"use client";
import { useState } from "react";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email wajib diisi.");
      return;
    }
    try {
      await api.post("/users/resend-verification", { email });
      toast.success("Email verifikasi dikirim ulang!");
      setSent(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Gagal mengirim email verifikasi.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Resend Verification Email</h1>
      {sent ? (
        <p className="text-green-600">
          Cek inbox kamu! Jika tidak masuk, cek folder spam.
        </p>
      ) : (
        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-3 py-2 rounded w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Kirim Ulang
          </button>
        </form>
      )}
    </div>
  );
}
