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
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-gray-900"
        >
          ARevents
        </Link>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all ${
                pathname === link.href
                  ? "text-gray-900 font-semibold"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/90 border-t border-gray-100 px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 text-sm font-medium transition-all ${
                pathname === link.href
                  ? "text-gray-900 font-semibold"
                  : "text-gray-700 hover:text-gray-900"
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
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="block mt-2 text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
