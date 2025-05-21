"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="text-center mt-32">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-6">
        You are not authorized to view this page.
      </p>
      <Link
        href="/"
        className="flex justify-center mt-6 pt-4 border-t border-gray-100 w-full text-center font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
