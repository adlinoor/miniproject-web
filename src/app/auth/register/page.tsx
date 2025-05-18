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
    first_name: z.string().min(1, "Nama depan wajib diisi"),
    last_name: z.string().min(1, "Nama belakang wajib diisi"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"], {
      required_error: "Role wajib dipilih",
    }),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    console.log("Submitting register:", data); // ✅ debug
    try {
      const { confirmPassword, ...payload } = data;
      const res = await api.post("/auth/register", payload);

      setCookie("access_token", res.data.token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      toast.success(res.data.message || "Registrasi berhasil");
      router.push("/");
    } catch (err: any) {
      console.error("Register error:", err); // ✅ debug
      toast.error(err?.response?.data?.message || "Register gagal");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Registrasi ARevents</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="first_name" placeholder="Nama Depan" />
          <Input name="last_name" placeholder="Nama Belakang" />
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Konfirmasi Password"
          />
          <Input name="referralCode" placeholder="Kode Referal (opsional)" />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <select {...methods.register("role")} className="input">
              <option value="">Pilih Role</option>
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
