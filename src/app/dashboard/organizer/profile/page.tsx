"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import EditProfileForm from "@/components/EditProfileForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function OrganizerEditProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ORGANIZER") {
      toast.error("Access denied: only organizers can edit this profile");
      router.push("/"); // redirect ke home atau halaman 403
    }
  }, [user, router]);

  if (!user) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Organizer Profile</h1>
      <EditProfileForm initialUser={user} />
    </section>
  );
}
