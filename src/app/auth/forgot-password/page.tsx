"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import authService from "@/services/auth.service";

type FormData = { email: string };

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
    <main className="min-h-screen flex justify-center pt-16 md:pt-28 pb-4 bg-gradient-to-br from-sky-100 via-white to-gray-50">
      <section className="w-full max-w-sm md:max-w-md bg-white border border-gray-200 p-4 md:p-8 rounded-2xl shadow-xl animate-fade-in-up">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
          Forgot Password
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
        >
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
          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </section>
    </main>
  );
}
