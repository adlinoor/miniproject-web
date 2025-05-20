"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";

interface GuestOnlyProps {
  children: React.ReactNode;
}

export default function GuestOnly({ children }: GuestOnlyProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      router.replace("/"); // Atau arahkan ke dashboard
    }
  }, [user, router]);

  // Jangan render apapun kalau sedang login (supaya tidak flicker)
  if (user) return null;

  return <>{children}</>;
}
