"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { IUser } from "@/interfaces/user.interface";

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading dashboard...</div>;

  if (!user)
    return <div className="text-center py-10 text-red-500">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center gap-4 bg-white shadow-md rounded-xl p-6">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
            ?
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold">Halo, {user.first_name} 👋</h2>
          {user.userPoints !== undefined && (
            <p className="text-sm text-gray-500">
              Poin Anda: {user.userPoints}
            </p>
          )}
          {user.referralCode && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-blue-700 font-mono">
                Referral Code: {user.referralCode}
              </span>
              <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900"
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode!);
                  toast.success("Referral code copied!");
                }}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          href="/dashboard/customer/profile"
          title="Edit Profile"
          emoji="📝"
        />
        <DashboardCard
          href="/dashboard/customer/profile#rewards"
          title="Points & Rewards"
          emoji="🎁"
        />
        <DashboardCard
          href="/dashboard/history"
          title="Transaction History"
          emoji="📜"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  href,
  title,
  emoji,
}: {
  href: string;
  title: string;
  emoji: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-[1.02] transition"
    >
      <div className="text-4xl">{emoji}</div>
      <h3 className="text-lg font-medium">{title}</h3>
    </Link>
  );
}
