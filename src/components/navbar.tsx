"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/authSlice";
import { deleteCookie } from "cookies-next";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("🧠 USER DARI REDUX:", user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    deleteCookie("access_token");
    dispatch(logout());
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="text-xl font-bold text-gray-900">
        ARevents
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/auth/login"
              className="text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-gray-700 hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/dashboard/${user.role.toLowerCase()}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-sm text-gray-700">Hi, {user.first_name}</span>
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
