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

    console.log("🚀 TOKEN DITEMUKAN:", token);

    if (!token || typeof token !== "string") {
      dispatch(logout());
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("🧩 PAYLOAD TERDECODE:", decoded);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn("⚠️ Token expired");
        dispatch(logout());
        return;
      }

      dispatch(
        login({
          user: {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            referralCode: decoded.referralCode ?? null,
          },
        })
      );
    } catch (error) {
      console.error("❌ Token tidak valid:", error);
      dispatch(logout());
    }
  }, [dispatch]);

  return <>{children}</>;
}
