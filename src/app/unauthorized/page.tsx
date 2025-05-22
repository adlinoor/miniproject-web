"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <section className="max-w-lg mx-auto mt-32 px-6 py-10 bg-white shadow-md rounded-xl text-center">
      <div className="flex justify-center mb-4 text-red-500">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        href="/"
        className="inline-block px-5 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition"
      >
        ← Back to Home
      </Link>
    </section>
  );
}
