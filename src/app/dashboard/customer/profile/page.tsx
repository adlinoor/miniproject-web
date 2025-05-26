"use client";

import { useEffect, useState, useCallback } from "react";
import EditProfileForm from "@/components/EditProfileForm";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";
import { IUser } from "@/interfaces/user.interface";

interface Coupon {
  code: string;
  discount: number;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export default function CustomerProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [resending, setResending] = useState(false);

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    // Fetch rewards/coupons
    const fetchRewards = async () => {
      try {
        const res = await api.get("/users/rewards");
        setCoupons(res.data.coupons?.available || []);
      } catch {}
      setLoadingRewards(false);
    };
    fetchRewards();
  }, [fetchUser]);

  // === Scroll otomatis ke bagian #rewards jika URL mengandung #rewards ===
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#rewards") {
      setTimeout(() => {
        const el = document.getElementById("rewards");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  // Resend verification email
  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await api.post("/users/resend-verification", { email: user.email });
      toast.success("Email verifikasi berhasil dikirim ulang!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Gagal mengirim ulang email verifikasi.";
      toast.error(msg);
      // Jika backend balas 'already verified', refetch profile
      if (msg.toLowerCase().includes("already verified")) {
        await fetchUser();
      }
    } finally {
      setResending(false);
    }
  };

  // Refresh user profile status
  const handleRefreshStatus = async () => {
    setLoading(true);
    await fetchUser();
    toast.success("Status verifikasi diperbarui.");
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }
  if (!user) {
    return <div className="text-center text-red-500 py-10">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
      {/* === Email Verification Notice === */}
      {user.role === "CUSTOMER" && user.isVerified === false ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded mb-6 gap-2">
          <span>
            Email <b>{user.email}</b>{" "}
            <span className="text-orange-700 font-medium">
              belum diverifikasi.
            </span>
            <span className="ml-1 text-gray-600 text-xs">
              (Cek folder spam jika belum masuk)
            </span>
          </span>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="text-blue-700 font-medium underline"
              disabled={resending}
              onClick={handleResendVerification}
            >
              {resending ? "Mengirim..." : "Kirim Ulang Email"}
            </button>
            <button
              className="text-xs text-gray-500 underline"
              title="Refresh status verifikasi"
              onClick={handleRefreshStatus}
            >
              Cek Status
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center bg-green-50 border-l-4 border-green-600 p-4 rounded mb-6">
          <svg
            className="w-6 h-6 text-green-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>
            <b>{user.email}</b>{" "}
            <span className="text-green-700 font-semibold">
              sudah terverifikasi
            </span>
          </span>
        </div>
      )}

      {/* === Profile Section === */}
      <section>
        <h1 className="text-2xl font-semibold mb-2">Profile</h1>
        <p className="text-gray-500 mb-6">
          Edit your information &amp; manage rewards
        </p>
        <EditProfileForm initialUser={user} />
      </section>

      <hr className="border-gray-200" />

      {/* === User Points & Coupons Section (PAKAI id="rewards") === */}
      <section
        id="rewards"
        className="space-y-6 bg-white rounded-xl border shadow px-6 py-4"
      >
        {user.userPoints !== undefined && (
          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-800">
              Your Points
            </h2>
            <p className="text-3xl font-bold text-sky-600">
              {user.userPoints} pts
            </p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Your Active Coupons
          </h2>
          {loadingRewards ? (
            <p className="text-gray-500 text-sm">Loading rewards...</p>
          ) : coupons.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No active coupons available.
            </p>
          ) : (
            <ul className="space-y-2">
              {coupons.map((c, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm text-gray-700 border-b pb-2"
                >
                  <span className="font-medium">{c.code}</span>
                  <span className="text-sky-600">{c.discount}% OFF</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
