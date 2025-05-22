"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: restrict access by role
  redirectTo?: string; // Optional: custom redirect path
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      toast.error("You must be logged in");
      router.replace("/auth/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access denied");
      router.replace(redirectTo);
    }
  }, [user, isHydrated, allowedRoles, redirectTo, router]);

  if (!isHydrated)
    return <div className="text-center py-12">Loading user...</div>;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
