// src/app/auth/register/page.tsx
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
import { useAppDispatch } from "@/lib/redux/hook";
import { login as setLogin } from "@/lib/redux/features/authSlice";

const schema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const methods = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await api.post("/auth/register", payload);

      const token = res.data.token;
      const user = res.data.user;

      setCookie("access_token", token);
      dispatch(setLogin({ user }));

      toast.success("Registration success");
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

          {/* Role selection */}
          <select
            {...methods.register("role")}
            className="w-full p-2 border border-gray-300 rounded bg-white"
          >
            <option value="">Select Role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ORGANIZER">Organizer</option>
          </select>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
