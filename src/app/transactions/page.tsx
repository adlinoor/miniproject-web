"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";

type Transaction = {
  id: number;
  event: { title: string };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/transactions/me")
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error("Fetch transactions error:", err);
        toast.error("Failed to load transactions");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-20">Loading transactions...</p>;

  if (!transactions.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Transactions Yet
        </h2>
        <p className="text-gray-500">Start by joining an event.</p>
        <a
          href="/events"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Browse Events
        </a>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        My Transactions
      </h1>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white"
          >
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {tx.event.title}
              </h2>
              <p className="text-sm text-gray-500">Transaction ID: #{tx.id}</p>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                Tickets: <strong>{tx.quantity}</strong>
              </p>
              <p>
                Total Paid:{" "}
                <strong>Rp{tx.totalPrice.toLocaleString("id-ID")}</strong>
              </p>
              <p>
                Status:{" "}
                <strong className="capitalize">
                  {tx.status.toLowerCase()}
                </strong>
              </p>

              {tx.paymentProof && (
                <div>
                  <p className="mt-2 text-gray-600">Payment Proof:</p>
                  <a
                    href={`/${tx.paymentProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
