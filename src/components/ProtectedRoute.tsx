"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional role restriction
  redirectTo?: string; // Optional custom redirect
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      toast.error("You must be logged in");
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access denied");
      router.replace(redirectTo);
    }
  }, [user, isHydrated, allowedRoles, redirectTo, router, pathname]);

  if (!isHydrated) {
    return <div className="text-center py-12">Loading user...</div>;
  }

  if (!user) return null;

  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
