"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/authSlice";
import { deleteCookie } from "cookies-next";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    deleteCookie("access_token");
    dispatch(logout());
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-900">
      <Link href="/" className="text-xl font-bold text-blue-600">
        EventHub
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-700 dark:text-white">
              Hi, {user.first_name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
