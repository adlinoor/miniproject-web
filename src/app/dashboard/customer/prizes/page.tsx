"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import { useAppSelector } from "@/lib/redux/hook";

export default function CustomerPrizesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [referralCount, setReferralCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await api.get("/users/me");
        setReferralCount(res.data?.data?.referralCount || 0);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">🎁 My Prizes</h1>

      {referralCount === null ? (
        <p className="text-gray-500">Loading your prizes...</p>
      ) : (
        <>
          <p className="text-lg mb-6">
            You have referred <strong>{referralCount}</strong>{" "}
            {referralCount === 1 ? "friend" : "friends"}!
          </p>

          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 text-white rounded-xl px-6 py-4 shadow-lg">
              <p className="text-xl font-semibold">
                {referralCount >= 5
                  ? "🏆 Gold Tier"
                  : referralCount >= 3
                  ? "🥈 Silver Tier"
                  : referralCount >= 1
                  ? "🥉 Bronze Tier"
                  : "No tier yet"}
              </p>
              <p className="text-sm mt-1">
                {referralCount >= 1
                  ? "You’ve earned a reward badge!"
                  : "Refer your friends to unlock prizes."}
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
