"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Link from "next/link";

import api from "@/lib/api-client";
import { login } from "@/lib/redux/features/authSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/login", data);
      dispatch(login(res.data.user));
      document.cookie = "logged_out=; Max-Age=0; path=/";
      toast.success("Login successful!");
      router.push(
        res.data.user.role === "ORGANIZER"
          ? "/dashboard/organizer"
          : "/dashboard/customer"
      );
    } catch {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-gray-50 px-4">
      <section className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in-up space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="accent-sky-600"
              />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
