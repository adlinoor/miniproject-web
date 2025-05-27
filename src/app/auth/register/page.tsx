"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "@/lib/api-client";
import { login } from "@/lib/redux/features/authSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", data);
      dispatch(login(res.data.user));
      toast.success("Registration successful!");
      setTimeout(() => {
        router.push(
          res.data.user.role === "ORGANIZER"
            ? "/dashboard/organizer"
            : "/dashboard/customer"
        );
      }, 200);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <main className="min-h-screen flex justify-center pt-16 md:pt-28 pb-4 bg-gradient-to-br from-sky-100 via-white to-gray-50">
      <section className="w-full max-w-sm md:max-w-md bg-white border border-gray-200 p-4 md:p-8 rounded-2xl shadow-xl animate-fade-in-up">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
          Register
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
        >
          <Input
            label="First Name"
            type="text"
            placeholder="Adli"
            {...register("first_name")}
            error={errors.first_name}
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Mumtaz"
            {...register("last_name")}
            error={errors.last_name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            {...register("email")}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password}
          />
          <Input
            label="Referral Code (optional)"
            type="text"
            placeholder="REF-ARevents"
            {...register("referralCode")}
            error={errors.referralCode}
          />
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Register as
            </label>
            <select
              {...register("role")}
              className="input"
              id="role"
              name="role"
            >
              <option value="">Select role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
