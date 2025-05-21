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
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* ✅ Logo tetap putih */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white drop-shadow-md"
        >
          ARevents
        </Link>

        {/* ✅ Hamburger / X tetap putih */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* ✅ Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium hover:text-sky-400 transition-all ${
                pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-white hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ✅ Mobile menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="md:hidden fixed top-[56px] left-0 w-full bg-white/70 backdrop-blur-sm z-50 shadow-md ring-1 ring-gray-200 rounded-b-xl px-4 pt-4 pb-6 animate-fade-in-up">
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-base font-medium transition-all ${
                    pathname === link.href
                      ? "text-sky-700 font-semibold"
                      : "text-gray-800 hover:text-sky-700"
                  }`}
                  onClick={() => setOpen(false)}
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
                  className="text-base text-red-600 hover:underline text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-base text-sky-700 hover:underline"
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
