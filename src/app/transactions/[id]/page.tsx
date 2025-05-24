"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api-client";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        setTransaction(res.data);
      } catch (err) {
        console.error("❌ Gagal fetch detail transaksi:", err);
        setError(true);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

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
          {new Date(transaction.createdAt).toLocaleString()}
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
    </div>
  );
}
