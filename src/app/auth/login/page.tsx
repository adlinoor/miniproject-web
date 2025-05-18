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

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const methods = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    console.log("Submitting login:", data); // ✅ debug
    try {
      const res = await api.post("/auth/login", data);

      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      toast.success(res.data.message || "Login berhasil");
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err); // ✅ debug
      toast.error(err?.response?.data?.message || "Login gagal");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Login ke ARevents</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
