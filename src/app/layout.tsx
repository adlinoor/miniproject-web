import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import StoreProvider from "@/components/storeProvider";
import AuthProvider from "@/components/authProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "ARevents - Discover Yours",
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
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <ClientLayoutWrapper>
                <main>{children}</main>
              </ClientLayoutWrapper>
              <Toaster position="top-center" />
            </div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
