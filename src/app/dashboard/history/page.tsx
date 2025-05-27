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
    id: number;
    name: string;
    location: string;
  };
  totalPaid: number;
  status: string;
  createdAt: string;
  isReviewed?: boolean;
}

export default function HistoryPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const rewardRes = await api.get("/users/rewards");
        const transactionRes = await api.get("/transactions/me");

        setCoupons([
          ...rewardRes.data.coupons.used,
          ...rewardRes.data.coupons.expired,
        ]);

        setTransactions(
          Array.isArray(transactionRes.data.data)
            ? transactionRes.data.data
            : []
        );
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user]);

  const handleSubmitReview = async (
    e: React.FormEvent,
    eventId: number,
    transactionId: number
  ) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const ratingValue = form.rating?.value?.trim();
    const rating = parseInt(ratingValue);
    const comment = form.comment?.value?.trim();

    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Rating harus antara 1 hingga 5");
      return;
    }

    try {
      await api.post("/reviews", { eventId, rating, comment });
      alert("✅ Review berhasil dikirim!");

      // Sembunyikan form dan tandai sebagai sudah review
      setShowForm((prev) => ({ ...prev, [transactionId]: false }));
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId ? { ...tx, isReviewed: true } : tx
        )
      );
    } catch (err: any) {
      console.error("❌ Gagal kirim review:", err.response?.data || err);
      const msg =
        err.response?.data?.message ||
        "Terjadi kesalahan saat mengirim review.";
      alert(`Gagal: ${msg}`);
    }
  };

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
              <ul className="space-y-4">
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
                      {typeof t.totalPaid === "number"
                        ? t.totalPaid.toLocaleString()
                        : 0}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </p>

                    {/* Review & Rating */}
                    {t.status === "DONE" && !t.isReviewed && (
                      <div className="mt-2">
                        {!showForm[t.id] ? (
                          <button
                            onClick={() =>
                              setShowForm((prev) => ({ ...prev, [t.id]: true }))
                            }
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Beri Review
                          </button>
                        ) : (
                          <form
                            onSubmit={(e) =>
                              handleSubmitReview(e, t.event.id, t.id)
                            }
                            className="space-y-2 mt-2"
                          >
                            <div>
                              <label className="text-sm">Rating (1–5)</label>
                              <select
                                name="rating"
                                className="border rounded p-1 w-full"
                              >
                                {[1, 2, 3, 4, 5].map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <textarea
                                name="comment"
                                placeholder="Tulis ulasanmu..."
                                className="border rounded p-2 w-full"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                            >
                              Kirim Review
                            </button>
                          </form>
                        )}
                      </div>
                    )}
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
