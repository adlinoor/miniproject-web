"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hook";
import { getProfile } from "@/lib/redux/features/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((err) => {
        if (err === "Unauthorized") {
          router.push("/auth/login");
        }
      });
  }, [dispatch, router]);

  return <>{children}</>;
}
