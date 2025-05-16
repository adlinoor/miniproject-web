"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/shared/InputField";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";

// 💡 Schema Zod untuk validasi
const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    referralCode: z.string().optional(), // Referral opsional
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function Register() {
  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const onSubmit = async (values: RegisterSchema) => {
    try {
      const { confirmPassword, ...payload } = values;
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        payload
      );
      toast.success(data.message);
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <InputField name="first_name" label="First Name" />
          <InputField name="last_name" label="Last Name" />
          <InputField name="email" label="Email" type="email" />
          <InputField name="password" label="Password" type="password" />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          <InputField
            name="referralCode"
            label="Referral Code (optional)"
            placeholder="ABC123"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
      </FormProvider>
    </section>
  );
}
