import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import StoreProvider from "@/components/storeProvider";
import AuthProvider from "@/components/authProvider";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "EventHub - Discover Amazing Events",
  description: "Find, create, and manage events all in one place",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Toaster /> {/* ini dari react-hot-toast */}
            </div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
