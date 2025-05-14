"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        {/* Form atau detail transaksi */}
      </section>
    </ProtectedRoute>
  );
}
