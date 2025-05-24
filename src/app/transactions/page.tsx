"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type Transaction = {
  id: number;
  event: { title: string; id: number };
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
        console.log("✅ Response:", res.data);
        setTransactions(res.data.data);
      } catch (err: any) {
        console.error("❌ API error:", err?.response?.data || err.message);
        toast.error(
          err?.response?.data?.message || "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No Transactions Yet
        </h2>
        <p className="text-gray-500 mb-4">Start by joining an event.</p>
        <Button
          onClick={() => router.push("/events")}
          variant="primary"
          className="mx-auto"
        >
          Browse Events
        </Button>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Transactions</h1>
        <Button
          onClick={() => router.push("/events")}
          variant="secondary"
          className="text-sm"
        >
          Browse Events
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tx.event.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Transaction #: {tx.id} •{" "}
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : tx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tx.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tickets</p>
                  <p className="font-medium">{tx.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium">
                    Rp{tx.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {tx.paymentProof && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Payment Proof</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${tx.paymentProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Payment Proof
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
