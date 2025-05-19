"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hook";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import EditProfileForm from "@/components/EditProfileForm";

export default function CustomerDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) return router.push("/auth/login");
    if (user.role !== "CUSTOMER") return router.push("/");

    api.get("/users/me").then((res) => {
      setPoints(res.data.userPoints || 0);
    });
  }, [user, router]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        {user && <EditProfileForm initialUser={user} />}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">My Points</h2>
        <p className="text-green-600 font-bold text-lg">{points} pts</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Referral Code</h2>
        <div className="flex items-center gap-3">
          <span className="font-mono bg-gray-100 px-3 py-1 rounded">
            {user?.referralCode || "-"}
          </span>
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(user?.referralCode || "");
            }}
          >
            Copy
          </Button>
        </div>
      </section>
    </main>
  );
}
