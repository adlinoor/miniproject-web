"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Verifikasi Gagal</h1>
      <p>
        {email
          ? `Gagal memverifikasi email: ${email}.`
          : "Gagal memverifikasi email."}
      </p>
      <p className="mt-2 text-gray-500">
        Cek ulang link verifikasi Anda atau daftar ulang.
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
