"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface Coupon {
  code: string;
  discount: number;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

interface Transaction {
  id: number;
  event: {
    name: string;
    location: string;
  };
  totalPaid: number;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const rewardRes = await api.get("/users/rewards");
        const transactionRes = await api.get("/transactions/myevents");

        setCoupons([
          ...rewardRes.data.coupons.used,
          ...rewardRes.data.coupons.expired,
        ]);
        setTransactions(transactionRes.data || []);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user]);

  if (!user || user.role !== "CUSTOMER") {
    return <p className="text-center mt-10">Unauthorized access.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My History</h1>

      {loading ? (
        <p>Loading history...</p>
      ) : (
        <>
          {/* Transaksi */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions found.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.map((t) => (
                  <li
                    key={t.id}
                    className="border p-4 rounded bg-white shadow-sm"
                  >
                    <p className="font-medium">
                      {t.event.name} —{" "}
                      <span className="text-sm text-gray-500">
                        {t.event.location}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {t.status} | Paid: Rp
                      {t.totalPaid.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <hr className="my-6 border-gray-200" />

          {/* Kupon */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Coupon History</h2>
            {coupons.length === 0 ? (
              <p className="text-gray-500">No used or expired coupons.</p>
            ) : (
              <ul className="space-y-3">
                {coupons.map((c, i) => (
                  <li key={i} className="border p-4 rounded bg-white shadow-sm">
                    <p className="font-medium flex items-center gap-2">
                      {c.code} — {c.discount}%
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          c.isUsed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {c.isUsed ? "Used" : "Expired"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Expired at: {new Date(c.expiresAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created at: {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
