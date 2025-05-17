"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Di sini nanti bisa tampil transaksi, kupon, event yang dibeli, dsb.
        </p>
      </section>
    </ProtectedRoute>
  );
}
