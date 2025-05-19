"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";

type Transaction = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  event: {
    title: string;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof: string | null;
};

export default function OrganizerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/organizer`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(data);
      } catch (err) {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (
    id: number,
    newStatus: "DONE" | "REJECTED"
  ) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Transaction ${newStatus}`);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, status: newStatus } : tx))
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>

        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border p-4 rounded shadow-sm">
                <p className="font-semibold">
                  {tx.user.first_name} {tx.user.last_name} ({tx.user.email})
                </p>
                <p>Event: {tx.event.title}</p>
                <p>Quantity: {tx.quantity}</p>
                <p>Total Price: Rp{tx.totalPrice.toLocaleString("id-ID")}</p>
                <p>
                  Status: <span className="font-medium">{tx.status}</span>
                </p>

                {tx.paymentProof && (
                  <a
                    href={tx.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Payment Proof
                  </a>
                )}

                {tx.status === "WAITING_CONFIRMATION" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      onClick={() => handleUpdateStatus(tx.id, "DONE")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                      onClick={() => handleUpdateStatus(tx.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
