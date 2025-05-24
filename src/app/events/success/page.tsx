"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-gray-50 p-6">
      <div className="max-w-3xl mx-auto mt-12 animate-fade-in-up">
        <div className="card bg-white rounded-xl p-8 text-center max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 flex justify-center items-center gap-2">
              <span className="text-green-500">✓</span>
              Checkout Successful!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your ticket has been successfully
              reserved.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/transactions")}
              variant="primary"
              className="w-full py-3 text-base"
              aria-label="View My Transactions"
            >
              View My Transactions
            </Button>

            <Link href="/events" className="block" aria-label="Back to Events">
              <Button variant="secondary" className="w-full py-3 text-base">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
