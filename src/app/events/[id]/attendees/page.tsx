"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectAttendeesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/organizer/attendees");
  }, [router]);

  return null;
}
