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

  if (!isHydrated) return null;

  const getDashboardLink = () => {
    if (user?.role === "CUSTOMER") return "/dashboard/customer";
    if (user?.role === "ORGANIZER") return "/dashboard/organizer";
    return "/dashboard"; // fallback
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 backdrop-blur bg-white/70 border-b border-gray-200 shadow-sm">
      <Link href="/" className="text-xl font-bold text-gray-800">
        ARevents
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {!user ? (
          <>
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-gray-700 hover:text-blue-600"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href={getDashboardLink()}
              className="text-blue-600 hover:underline font-medium"
            >
              Dashboard
            </Link>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {user.first_name} {user.last_name}
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
