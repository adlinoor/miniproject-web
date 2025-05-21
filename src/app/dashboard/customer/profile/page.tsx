"use client";

import { useEffect, useState } from "react";
import EditProfileForm from "@/components/EditProfileForm";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

interface User {
  first_name: string;
  last_name: string;
  profilePicture?: string;
  userPoints?: number;
}

interface Coupon {
  code: string;
  discount: number;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchRewards = async () => {
      try {
        const res = await api.get("/users/rewards");
        const active = res.data.coupons?.available || [];
        setCoupons(active);
      } catch (err) {
        console.error("Failed to load rewards", err);
      } finally {
        setLoadingRewards(false);
      }
    };

    fetchUser();
    fetchRewards();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 py-10">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-12">
      {/* === Section: Edit Profile === */}
      <section>
        <h1 className="text-2xl font-semibold mb-2">Profile</h1>
        <p className="text-gray-500 mb-6">
          Edit your information & manage rewards
        </p>
        <EditProfileForm initialUser={user} />
      </section>

      <hr className="border-gray-200" />

      {/* === Section: User Points === */}
      {user.userPoints !== undefined && (
        <section className="bg-white rounded-xl border shadow px-6 py-4">
          <h2 className="text-lg font-semibold mb-1 text-gray-800">
            Your Points
          </h2>
          <p className="text-3xl font-bold text-sky-600">
            {user.userPoints} pts
          </p>
        </section>
      )}

      {/* === Section: Active Coupons === */}
      <section className="bg-white rounded-xl border shadow px-6 py-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Your Active Coupons
        </h2>

        {loadingRewards ? (
          <p className="text-gray-500 text-sm">Loading rewards...</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-500 text-sm">No active coupons available.</p>
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
      </section>
    </div>
  );
}
