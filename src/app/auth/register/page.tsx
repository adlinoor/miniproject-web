"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { login } from "@/lib/redux/features/authSlice";
import { useEffect } from "react";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post("/auth/register", data);

      // Set cookie + Redux
      setCookie("access_token", response.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      dispatch(login(response.data.user));

      toast.success("Registration successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="max-w-md mx-auto p-6">
      <section className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-left">
          Register
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name")}
              className="input"
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name")}
              className="input"
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Referral Code (optional)
            </label>
            <input
              type="text"
              {...register("referralCode")}
              className="input"
              placeholder="FRIEND123"
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
