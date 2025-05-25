"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailSuccessPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Verifikasi Email Berhasil</h1>
      <p className="mb-2 text-green-600">
        Email <b>{email}</b> berhasil diverifikasi!
      </p>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/auth/login")}
      >
        Login
      </button>
    </div>
  );
}
