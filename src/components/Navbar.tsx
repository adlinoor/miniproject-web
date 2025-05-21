"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hook";
import { logout } from "@/lib/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { deleteCookie } from "cookies-next";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    deleteCookie("access_token");
  };

  const links = [
    { label: "Events", href: "/events" },
    ...(user
      ? [
          user.role === "ORGANIZER"
            ? { label: "Profile", href: "/dashboard/organizer/profile" }
            : { label: "Profile", href: "/dashboard/customer/profile" },
          user.role === "ORGANIZER"
            ? { label: "Dashboard", href: "/dashboard/organizer" }
            : { label: "Dashboard", href: "/dashboard/customer" },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* ✅ Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white drop-shadow-sm"
        >
          ARevents
        </Link>

        {/* ✅ Hamburger / X icon */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full bg-white/80 shadow-sm transition"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="w-5 h-5 text-gray-800" />
            ) : (
              <Menu className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-14 left-0 w-full px-4 z-50 md:hidden">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "text-sky-700 font-semibold"
                      : "text-gray-800 hover:text-sky-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-base text-red-600 hover:text-red-700 text-left transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-base text-sky-700 hover:text-sky-800 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
