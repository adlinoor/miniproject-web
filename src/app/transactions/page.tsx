"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";

type Transaction = {
  id: number;
  event: { title: string };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof?: string;
  createdAt: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/me");
        setTransactions(res.data.data || []);
      } catch (err) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  if (!transactions.length)
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500 mb-4">
          Kamu belum memiliki transaksi.
        </p>
        <Button onClick={() => router.push("/events")}>Jelajahi Event</Button>
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Transactions</h1>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white p-6 rounded-lg shadow border flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="mb-2 sm:mb-0">
              <p className="font-semibold text-gray-800">{tx.event.title}</p>
              <p className="text-sm text-gray-500">
                #{tx.id} — {new Date(tx.createdAt).toLocaleDateString("id-ID")}
              </p>
              <p className="text-sm">
                Total: Rp{(tx.totalPrice ?? 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                {tx.status}
              </span>
              <Button onClick={() => router.push(`/transactions/${tx.id}`)}>
                Detail Transaction
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
