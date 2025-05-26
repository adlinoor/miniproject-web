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
  requireVerified = false, // default: tidak wajib verified
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

      if (!user) {
        toast.error("Please login to continue");
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("You don't have permission to access this page");
        router.replace(redirectTo);
      } else if (user.role === "CUSTOMER" && user.isVerified === false) {
        toast.error("Please verify your email first");
        router.replace("/verify-email-notice"); // custom page, buat sesuai kebutuhan
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

  // Sembunyikan children sampai state siap & lolos semua pengecekan
  if (isChecking || !isHydrated) return loadingFallback;

  // Render children hanya jika lolos semua filter
  if (
    !user ||
    (allowedRoles && !allowedRoles.includes(user.role)) ||
    (requireVerified && user.isVerified === false)
  ) {
    return null;
  }

  return <>{children}</>;
}
