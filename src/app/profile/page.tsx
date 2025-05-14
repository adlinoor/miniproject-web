"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  const user = useSelector((state: RootState) => state.auth.user);
  const [points, setPoints] = useState<Point[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/rewards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setPoints(data.pointHistory || []);
        setCoupons([
          ...(data.coupons?.active || []),
          ...(data.coupons?.used || []),
          ...(data.coupons?.expired || []),
        ]);
        setTotalPoints(data.totalActivePoints || 0);
      } catch (error) {
        console.error("Failed to fetch user rewards:", error);
      }
    };

    if (user) fetchRewards();
  }, [user]);

  return (
    <ProtectedRoute>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="mb-8">
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
            <strong>Referral Code:</strong> {user?.referralCode || "-"}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Total Active Points</h2>
          <p className="text-lg text-green-600 font-bold">{totalPoints} pts</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Point History</h2>
          <ul className="space-y-2">
            {points.length > 0 ? (
              points.map((point) => (
                <li key={point.id} className="text-sm border p-2 rounded">
                  <p>+{point.amount} pts</p>
                  <p className="text-gray-500">
                    Exp: {format(new Date(point.expiresAt), "dd MMM yyyy")}
                  </p>
                </li>
              ))
            ) : (
              <p>No points yet.</p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Coupons</h2>
          <ul className="space-y-2">
            {coupons.length > 0 ? (
              coupons.map((c) => (
                <li key={c.id} className="text-sm border p-2 rounded">
                  <p>
                    <strong>{c.code}</strong> - {c.discount}% off
                  </p>
                  <p className="text-gray-500">
                    Status:{" "}
                    {c.isUsed
                      ? "Used"
                      : new Date(c.expiresAt) < new Date()
                      ? "Expired"
                      : "Active"}
                  </p>
                  <p className="text-gray-500">
                    Exp: {format(new Date(c.expiresAt), "dd MMM yyyy")}
                  </p>
                </li>
              ))
            ) : (
              <p>No coupons yet.</p>
            )}
          </ul>
        </div>
      </section>
    </ProtectedRoute>
  );
}
