"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TransactionStatusBadge from "@/components/transactions/TransactionStatusBadge";

type Transaction = {
  id: number;
  eventName: string;
  status: string;
  totalPrice: number;
  quantity: number;
  createdAt: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    axios
      .get("/api/transactions/me")
      .then((res) => setTransactions(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Event</th>
            <th>Status</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b">
              <td>{tx.eventName}</td>
              <td>
                <TransactionStatusBadge status={tx.status as any} />
              </td>
              <td>{tx.quantity}</td>
              <td>{tx.totalPrice.toLocaleString()}</td>
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
