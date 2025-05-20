"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrganizerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ORGANIZER") {
      toast.error("Access denied: Organizer only");
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "ORGANIZER") {
    return <div className="text-center py-10">Checking access...</div>;
  }

  return <>{children}</>;
}
