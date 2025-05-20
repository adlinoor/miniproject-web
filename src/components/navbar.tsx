"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/authSlice";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    deleteCookie("access_token");
    dispatch(logout());
    router.push("/auth/login");
  };

  const getDashboardLink = () => {
    if (user?.role === "CUSTOMER") return "/dashboard/customer";
    if (user?.role === "ORGANIZER") return "/dashboard/organizer";
    return "/dashboard";
  };

  const getProfileLink = () =>
    user?.role === "CUSTOMER"
      ? "/dashboard/customer/profile"
      : "/dashboard/organizer/profile";

  if (!isHydrated) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      {/* Left Logo */}
      <Link href="/" className="text-xl font-bold text-blue-600">
        ARevents
      </Link>

      {/* Right Menu Button (always) */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-sm text-gray-700 border border-gray-300 rounded px-3 py-1 shadow-sm hover:bg-gray-50 transition"
        >
          ☰ Menu
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-44 z-50">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block px-4 py-2 hover:bg-gray-50 text-sm text-blue-600"
                >
                  Dashboard
                </Link>
                <span className="block px-4 py-2 text-sm text-gray-700 font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
