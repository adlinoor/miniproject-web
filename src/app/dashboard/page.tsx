"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hook";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardRedirectPage() {
  return (
    <ProtectedRoute>
      <DashboardRedirect />
    </ProtectedRoute>
  );
}

function DashboardRedirect() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  if (user === undefined) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      router.replace("/dashboard/customer");
    } else if (user?.role === "ORGANIZER") {
      router.replace("/dashboard/organizer");
    } else {
      router.replace("/");
    }
  }, [user, router]);

  // ⚠ Ini penting → agar Vercel tidak anggap halaman ini "kosong"
  return (
    <div className="text-center py-20 text-gray-500">
      Redirecting to your dashboard...
    </div>
  );
}
