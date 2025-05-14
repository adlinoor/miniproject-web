"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-toastify";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Opsional: jika tidak diberikan, berarti semua role boleh
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in");
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access denied");
      router.replace("/unauthorized"); // Optional page, or use router.replace("/") for homepage
    }
  }, [user, allowedRoles, router]);

  // Jika user belum siap (masih undefined/null), atau tidak punya akses, render kosong
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}

// Untuk semua yang sudah login
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>

// Hanya untuk CUSTOMER
// <ProtectedRoute allowedRoles={["CUSTOMER"]}>
//   <TicketPage />
// </ProtectedRoute>

// Hanya untuk ORGANIZER
// <ProtectedRoute allowedRoles={["ORGANIZER"]}>
//   <CreateEvent />
// </ProtectedRoute>
