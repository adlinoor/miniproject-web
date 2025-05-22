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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", data);

      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
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
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code (optional)
            </label>
            <input
              type="text"
              {...register("referralCode")}
              className="input"
              placeholder="FRIEND123"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
