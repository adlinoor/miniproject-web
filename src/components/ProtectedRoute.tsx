"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Opsional: batasi role
  redirectTo?: string; // Opsional: redirect jika tidak punya akses
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/unauthorized", // Default redirect jika akses ditolak
}: ProtectedRouteProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in");
      router.replace("/auth/login"); // Arahkan ke login yang benar
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access denied");
      router.replace(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, router]);

  // Render kosong kalau user belum siap atau tidak punya akses
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}

{
  /* <ProtectedRoute>
  <Dashboard />
</ProtectedRoute> */
}

{
  /* <ProtectedRoute allowedRoles={["CUSTOMER"]}>
  <CustomerDashboard />
</ProtectedRoute> */
}

{
  /* <ProtectedRoute allowedRoles={["ORGANIZER"]} redirectTo="/">
  <CreateEvent />
</ProtectedRoute> */
}
