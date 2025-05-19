"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hook";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api-client";
import { format } from "date-fns";

type Point = {
  id: number;
  amount: number;
  createdAt: string;
  expiresAt: string;
};

type Coupon = {
  id: string;
  code: string;
  discount: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string;
};

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [points, setPoints] = useState<Point[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data } = await api.get("/users/me");
        setPoints(data.pointHistory || []);
        setCoupons([
          ...(data.coupons?.active || []),
          ...(data.coupons?.used || []),
          ...(data.coupons?.expired || []),
        ]);
        setTotalPoints(data.userPoints || 0);
      } catch (error) {
        console.error("Failed to fetch user rewards:", error);
      }
    };

    if (user) fetchRewards();
  }, [user]);

  const getCouponStatus = (c: Coupon) => {
    if (c.isUsed) return "Used";
    if (new Date(c.expiresAt) < new Date()) return "Expired";
    return "Active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Used":
        return "bg-gray-400 text-white";
      case "Expired":
        return "bg-red-500 text-white";
      case "Active":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <ProtectedRoute>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="mb-8 space-y-1">
          <p>
            <strong>Name:</strong> {user?.first_name} {user?.last_name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
          <p>
            <strong>Referral Code:</strong>{" "}
            <span className="font-mono">{user?.referralCode || "-"}</span>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Total Active Points</h2>
          <p className="text-lg text-green-600 font-bold">{totalPoints} pts</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Point History</h2>
          {points.length > 0 ? (
            <ul className="space-y-2">
              {points.map((point) => (
                <li
                  key={point.id}
                  className="text-sm border p-3 rounded shadow-sm bg-gray-50"
                >
                  <p>+{point.amount} pts</p>
                  <p className="text-gray-500 text-xs">
                    Expires: {format(new Date(point.expiresAt), "dd MMM yyyy")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-gray-500">
              Belum ada histori poin.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Coupons</h2>
          {coupons.length > 0 ? (
            <ul className="space-y-3">
              {coupons.map((c) => {
                const status = getCouponStatus(c);
                const statusColor = getStatusColor(status);
                return (
                  <li
                    key={c.id}
                    className="text-sm border p-3 rounded shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <p>
                        <strong>{c.code}</strong> - {c.discount}% off
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusColor}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Expires: {format(new Date(c.expiresAt), "dd MMM yyyy")}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm italic text-gray-500">Belum ada kupon.</p>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
