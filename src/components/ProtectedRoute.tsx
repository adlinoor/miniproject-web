"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
  redirectTo?: string;
  loadingFallback?: React.ReactNode;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireVerified = false,
  redirectTo = "/unauthorized",
  loadingFallback = null,
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isHydrated } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const checkAccess = async () => {
      setIsChecking(true);

      // === HARUS LOGIN ===
      if (!user) {
        toast.error("Please login to continue");
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      }
      // === ROLE TIDAK DIIJINKAN ===
      else if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("You don't have permission to access this page");
        router.replace(redirectTo);
      }
      // === KHUSUS: REQUIRE VERIFIED ===
      else if (
        requireVerified &&
        user.role === "CUSTOMER" &&
        user.isVerified === false
      ) {
        toast.error("Please verify your email first");
        router.replace("/verify-email-notice");
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [
    user,
    isHydrated,
    allowedRoles,
    requireVerified,
    redirectTo,
    router,
    pathname,
  ]);

  if (isChecking || !isHydrated) return loadingFallback;

  if (
    !user ||
    (allowedRoles && !allowedRoles.includes(user.role)) ||
    (requireVerified && user.role === "CUSTOMER" && user.isVerified === false)
  ) {
    return null;
  }

  return <>{children}</>;
}
