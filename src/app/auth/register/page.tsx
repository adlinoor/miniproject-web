"use client";

import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";

const registerSchema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await api.post("/auth/register", payload);

      // ✅ Simpan token ke cookie
      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      toast.success(res.data.message);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Register at ARevents</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="first_name" placeholder="First Name" />
          <Input name="last_name" placeholder="Last Name" />
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <Input name="referralCode" placeholder="Referral Code (optional)" />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <select {...methods.register("role")} className="input">
              <option value="">Select role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
