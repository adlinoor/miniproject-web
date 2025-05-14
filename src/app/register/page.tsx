"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "./schema";
import InputField from "@/components/ui/InputField";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputField name="first_name" label="First Name" />
          <InputField name="last_name" label="Last Name" />
          <InputField name="email" label="Email" type="email" />
          <InputField name="password" label="Password" type="password" />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
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
