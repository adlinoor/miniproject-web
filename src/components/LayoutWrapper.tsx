"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import AppBackgroundWrapper from "@/components/AppBackgroundWrapper";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <AppBackgroundWrapper>
      <div className="min-h-screen flex flex-col">
        {!isAuthPage && <Navbar />}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </div>
    </AppBackgroundWrapper>
  );
}
