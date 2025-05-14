"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { registerSchema, RegisterSchema } from "./schema";
import InputField from "@/components/ui/InputField";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  // Isi referral code dari query param ?ref=...
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      methods.setValue("referralCode", ref);
    }
  }, [searchParams, methods]);

  const onSubmit = async (values: RegisterSchema) => {
    try {
      const { confirmPassword, ...payload } = values;

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        payload
      );

      toast.success(data.message || "Registration successful");
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
            label="Referral Code (Optional)"
            placeholder="e.g. ABC123"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </FormProvider>
    </section>
  );
}
