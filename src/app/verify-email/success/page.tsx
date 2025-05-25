"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Verifikasi Berhasil!
      </h1>
      <p>
        {email
          ? `Email ${email} berhasil diverifikasi.`
          : "Email berhasil diverifikasi."}
      </p>
      <p className="mt-2 text-gray-500">Kamu bisa login sekarang.</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
