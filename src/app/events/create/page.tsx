"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative(),
  start_date: z.string(),
  end_date: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "ORGANIZER") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "ORGANIZER") return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("🚀 Creating event:", data);
      await api.post("/events", data);
      toast.success("Event created!");
      router.push("/my-events");
    } catch (error) {
      console.error("❌ Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Event Name"
          error={errors.name}
        />
        <Input
          {...register("location")}
          placeholder="Location"
          error={errors.location}
        />
        <Input
          type="number"
          placeholder="Price (IDR)"
          {...register("price", { valueAsNumber: true })}
          error={errors.price}
        />
        <Input
          type="date"
          {...register("start_date")}
          error={errors.start_date}
        />
        <Input type="date" {...register("end_date")} error={errors.end_date} />
        <Input
          placeholder="Description"
          {...register("description")}
          error={errors.description}
        />
        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </section>
  );
}
