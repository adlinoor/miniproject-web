"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hook";
import { getProfile } from "@/lib/redux/features/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return <>{children}</>;
}
