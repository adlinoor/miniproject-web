"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "./schema";
import InputField from "@/components/ui/InputField";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        values
      );

      dispatch(login({ user: data.user }));
      setCookie("access_token", data.token);
      toast.success(data.message);

      const fallback = data.user.role === "organizer" ? "/dashboard" : "/";
      router.push(redirect || fallback);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputField name="email" label="Email" type="email" />
          <InputField name="password" label="Password" type="password" />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </FormProvider>
    </section>
  );
}
