"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/users/verify-email/${encodeURIComponent(email)}`);
        toast.success("Email berhasil diverifikasi!");
        router.replace(
          `/verify-email/success?email=${encodeURIComponent(email)}`
        );
      } catch (err: any) {
        toast.error("Gagal memverifikasi email.");
        router.replace(
          `/verify-email/failed?email=${encodeURIComponent(email)}`
        );
      }
    };
    verify();
  }, [email, router]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Memverifikasi Email...
      </h1>
      <p className="text-gray-500">
        Silakan tunggu, email sedang diverifikasi.
      </p>
    </div>
  );
}
