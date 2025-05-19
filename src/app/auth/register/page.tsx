"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { login } from "@/lib/redux/features/authSlice";
import api from "@/lib/api-client";

const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      return data.role !== "CUSTOMER" || !!data.referralCode?.trim();
    },
    {
      message: "Referral code is required for Customer",
      path: ["referralCode"],
    }
  );

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;

      const res = await api.post("/auth/register", payload);

      // ✅ Simpan token
      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        secure: false,
      });

      // ✅ Simpan user ke Redux
      dispatch(login(res.data.user));

      toast.success("Registration successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input {...register("first_name")} placeholder="First Name" />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}

          <Input {...register("last_name")} placeholder="Last Name" />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}

          <Input {...register("email")} type="email" placeholder="Email" />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}

          <Input {...register("referralCode")} placeholder="Referral Code" />
          {errors.referralCode && (
            <p className="text-sm text-red-500">
              {errors.referralCode.message}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              {...register("role")}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </section>
    </main>
  );
}
