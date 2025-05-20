"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/authSlice";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserCircle } from "lucide-react";

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

  const getDashboardLink = () =>
    user?.role === "CUSTOMER" ? "/dashboard/customer" : "/dashboard/organizer";

  const getProfileLink = () =>
    user?.role === "CUSTOMER"
      ? "/dashboard/customer/profile"
      : "/dashboard/organizer/profile";

  // Skeleton saat belum siap
  if (!isHydrated) {
    return (
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-blue-600">
        ARevents
      </Link>

      {/* 👀 Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 text-sm">
        {!user ? (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:underline">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-gray-700 hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href={getDashboardLink()}
              className="text-blue-600 hover:underline"
            >
              Dashboard
            </Link>

            <Link
              href={getProfileLink()}
              className="flex items-center gap-2 hover:underline text-gray-700 font-medium"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover border"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-gray-400" />
              )}
              {user.first_name} {user.last_name}
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* 📱 Mobile Menu */}
      <div className="md:hidden relative">
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
                <Link
                  href={getProfileLink()}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {user.first_name} {user.last_name}
                </Link>
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
