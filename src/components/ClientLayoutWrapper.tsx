"use client";
import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>; // No main wrapper, no padding
  }

  return (
    <main
      className={`flex-1 w-full ${
        isHome ? "" : "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20"
      }`}
    >
      {children}
    </main>
  );
}
