"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <section className="max-w-xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              {...register("first_name")}
              className="w-full border p-2 rounded"
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              {...register("last_name")}
              className="w-full border p-2 rounded"
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
