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
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          ARevents
        </Link>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium hover:text-primary transition-all ${
                pathname === link.href ? "text-primary" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 text-sm font-medium hover:text-primary transition-all ${
                pathname === link.href ? "text-primary" : "text-gray-700"
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
              className="block mt-2 text-sm text-primary hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
