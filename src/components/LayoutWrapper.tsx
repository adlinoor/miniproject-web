"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-white to-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <main
        className={`flex-1 w-full ${
          isHome ? "" : "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
