"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import authService from "@/services/auth.service";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success("Reset link sent if email is registered.");
    } catch {
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <section className="bg-white border border-gray-200 shadow rounded-2xl p-8">
        <h1 className="text-xl font-bold mb-4 text-gray-800">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </section>
    </main>
  );
}
