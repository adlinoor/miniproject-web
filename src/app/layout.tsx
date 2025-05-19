import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import StoreProvider from "@/components/storeProvider";
import AuthProvider from "@/components/authProvider";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ARevents - Discover Amazing Events",
  description: "Find, create, and manage events all in one place.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <StoreProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {children}
              </main>
              <Toaster />
            </div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
