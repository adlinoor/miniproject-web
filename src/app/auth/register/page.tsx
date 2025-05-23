"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import Link from "next/link";

import api from "@/lib/api-client";
import { login } from "@/lib/redux/features/authSlice";
import Button from "@/components/ui/Button";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
  role: z.enum(["CUSTOMER", "ORGANIZER"], {
    required_error: "Please select a role",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", data);

      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      dispatch(login(res.data.user));
      toast.success("Registration successful!");

      router.push(
        res.data.user.role === "ORGANIZER"
          ? "/dashboard/organizer"
          : "/dashboard/customer"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <section className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-left">
          Register
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {[
            {
              label: "First Name",
              name: "first_name",
              type: "text",
              placeholder: "John",
            },
            {
              label: "Last Name",
              name: "last_name",
              type: "text",
              placeholder: "Doe",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "email@example.com",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "••••••••",
            },
            {
              label: "Referral Code (optional)",
              name: "referralCode",
              type: "text",
              placeholder: "FRIEND123",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                {...register(field.name as keyof RegisterFormData)}
                className="input"
                placeholder={field.placeholder}
              />
              {errors[field.name as keyof RegisterFormData] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[field.name as keyof RegisterFormData]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Register as
            </label>
            <select {...register("role")} className="input">
              <option value="">Select role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
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
