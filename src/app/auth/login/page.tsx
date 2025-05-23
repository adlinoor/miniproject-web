"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";
import Link from "next/link";

import { login } from "@/lib/redux/features/authSlice";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import InputField from "@/components/shared/InputField";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const methods = useForm<FormData>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/login", data);

      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: data.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 1,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      dispatch(login(res.data.user));
      toast.success("Login successful!");
      router.push(
        res.data.user.role === "ORGANIZER"
          ? "/dashboard/organizer"
          : "/dashboard/customer"
      );
    } catch (err: any) {
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
    <main className="max-w-md mx-auto p-6">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-left">
          Login
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField<FormData>
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...methods.register("password", {
                    required: "Password is required",
                  })}
                  className="input pr-16"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {methods.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {methods.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700 whitespace-nowrap">
                <input type="checkbox" {...methods.register("rememberMe")} />
                Remember me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-700"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
