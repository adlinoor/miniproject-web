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

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      router.replace("/dashboard/customer");
    } else if (user?.role === "ORGANIZER") {
      router.replace("/dashboard/organizer");
    } else {
      router.replace("/");
    }
  }, [user, router]);

  return <p className="text-center py-20">Redirecting to your dashboard...</p>;
}
