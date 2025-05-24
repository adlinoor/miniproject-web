"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api-client";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        console.log("✅ Transaksi berhasil diambil:", res.data);
        setTransaction(res.data);
      } catch (err) {
        console.error("❌ Gagal fetch detail transaksi:", err);
        setError(true);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const rating = parseInt((form.rating as any).value);
    const comment = (form.comment as any).value;

    try {
      await api.post("/reviews", {
        eventId: transaction.event.id,
        rating,
        comment,
      });
      setReviewSent(true);
      alert("✅ Review berhasil dikirim!");
    } catch (err) {
      console.error("❌ Gagal kirim review:", err);
      alert("Gagal mengirim review.");
    }
  };

  const alreadyReviewed =
    Array.isArray(transaction?.event?.reviews) &&
    transaction.event.reviews.some((r: any) => r.userId === transaction.userId);

  if (error)
    return (
      <div className="p-6 text-red-600">
        Failed to load transaction details.
      </div>
    );
  if (!transaction) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Transaction Detail</h1>

      <div className="bg-white shadow p-6 rounded space-y-4">
        <p>
          <strong>Event:</strong> {transaction.event?.title}
        </p>
        <p>
          <strong>Transaction ID:</strong> {transaction.id}
        </p>
        <p>
          <strong>Status:</strong> {transaction.status}
        </p>
        <p>
          <strong>Ticket Quantity:</strong> {transaction.quantity}
        </p>
        <p>
          <strong>Total:</strong> Rp
          {transaction.totalPrice.toLocaleString("id-ID")}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(transaction.createdAt).toLocaleString("id-ID")}
        </p>

        {transaction.paymentProof && (
          <div>
            <p>
              <strong>Payment Proof:</strong>
            </p>
            <img
              src={transaction.paymentProof}
              alt="Bukti Pembayaran"
              className="max-w-full h-auto mt-2 border rounded"
            />
          </div>
        )}
      </div>

      {/* Review & Rating Section */}
      {transaction.status === "DONE" && !alreadyReviewed && !reviewSent && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">
            Berikan Review & Rating
          </h2>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Rating (1–5)</label>
              <select name="rating" className="mt-1 border p-2 rounded w-full">
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Komentar</label>
              <textarea
                name="comment"
                className="mt-1 border p-2 rounded w-full"
                placeholder="Tulis ulasan tentang event ini..."
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={reviewSent}
            >
              {reviewSent ? "Review Terkirim" : "Kirim Review"}
            </button>
          </form>
        </div>
      )}

      {reviewSent && (
        <div className="mt-6 text-green-700 font-medium">
          Terima kasih atas review Anda!
        </div>
      )}
    </div>
  );
}
