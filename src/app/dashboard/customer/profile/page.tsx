"use client";

import { useEffect, useState } from "react";
import EditProfileForm from "@/components/EditProfileForm";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";

interface User {
  first_name: string;
  last_name: string;
  profilePicture?: string;
}

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 py-10">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Profile</h1>
      <p className="text-gray-500 mb-6">
        Edit your information & manage rewards
      </p>
      <EditProfileForm initialUser={user} />
    </div>
  );
}
