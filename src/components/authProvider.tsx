"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hook";
import { getProfile, logout } from "@/lib/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      dispatch(logout());
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        dispatch(logout());
        localStorage.removeItem("access_token");
      } else {
        dispatch(getProfile());
      }
    } catch (err) {
      dispatch(logout());
      localStorage.removeItem("access_token");
    }
  }, [dispatch]);

  return <>{children}</>;
}
