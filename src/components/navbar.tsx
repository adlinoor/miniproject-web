"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/features/authSlice";
import { deleteCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);

  const handleLogout = () => {
    deleteCookie("access_token");
    dispatch(logout());
    toast.success("Logout successful");
    router.push("/auth/login");
  };

  // ✅ Jangan render sebelum Redux siap
  if (!isHydrated) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="text-xl font-bold text-gray-900">
        ARevents
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {!user ? (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:underline">
              Login
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/auth/register"
              className="text-gray-700 hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* ✅ Hanya tampilkan dashboard jika user bukan CUSTOMER */}
            {user.role && (
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            )}

            <span className="text-gray-700">
              Hi, <strong>{user.first_name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
