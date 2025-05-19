"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hook";
import { login, logout } from "@/lib/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";

interface JwtPayload {
  id: number;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
  first_name: string;
  last_name: string;
  referralCode?: string;
  exp: number;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getCookie("access_token");
    console.log("🚀 access_token dari cookie:", token);

    console.log("🚀 TOKEN DITEMUKAN:", token);

    if (!token || typeof token !== "string") {
      dispatch(logout());
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("🚀 access_token dari cookie:", token);

      console.log("🧩 JWT decoded payload:", decoded);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn("⚠️ Token expired");
        dispatch(logout());
        return;
      }

      console.log("📤 Dispatching to Redux:", {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        referralCode: decoded.referralCode ?? null,
      });

      dispatch(
        login({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          referralCode: decoded.referralCode ?? null,
        })
      );

      setTimeout(() => {
        console.log(
          "📦 Redux state after dispatch:",
          (window as any).__REDUX_STATE__
        );
      }, 500);
    } catch (error) {
      console.error("❌ Token tidak valid:", error);
      dispatch(logout());
    }
  }, [dispatch]);

  return <>{children}</>;
}
