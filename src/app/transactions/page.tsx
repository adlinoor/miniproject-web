"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import Badge from "@/components/ui/Badge";

type Transaction = {
  id: number;
  event_name: string;
  amount: number;
  status: "waiting" | "done" | "rejected";
  created_at: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/users/transactions").then((res) => setTransactions(res.data));
  }, []);

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-600">You have no transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Event</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="text-sm border-b border-gray-100">
                  <td className="px-4 py-2">{tx.event_name}</td>
                  <td className="px-4 py-2">
                    IDR {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <Badge status={tx.status} />
                  </td>
                  <td className="px-4 py-2">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
