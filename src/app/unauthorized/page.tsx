"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="text-center mt-32">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-6">
        You are not authorized to view this page.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
