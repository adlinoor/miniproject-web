"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  availableSeats: z
    .number({ invalid_type_error: "Seats must be a number" })
    .min(1, "At least 1 seat required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/events", data);
      toast.success("Event created successfully!");
      router.push("/dashboard/organizer");
    } catch (err: any) {
      console.error("Create event error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create a New Event
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Title"
            placeholder="e.g. Music Festival"
            {...register("title")}
            error={errors.title}
          />
          <Input
            label="Location"
            placeholder="e.g. Istora Senayan"
            {...register("location")}
            error={errors.location}
          />
          <Input
            label="Category"
            placeholder="e.g. Music, Workshop, Seminar"
            {...register("category")}
            error={errors.category}
          />
          <Input
            label="Start Date"
            type="date"
            {...register("startDate")}
            error={errors.startDate}
          />
          <Input
            label="End Date"
            type="date"
            {...register("endDate")}
            error={errors.endDate}
          />
          <Input
            label="Price (IDR)"
            type="number"
            placeholder="e.g. 50000"
            {...register("price", { valueAsNumber: true })}
            error={errors.price}
          />
          <Input
            label="Available Seats"
            type="number"
            placeholder="e.g. 100"
            {...register("availableSeats", { valueAsNumber: true })}
            error={errors.availableSeats}
          />
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe your event..."
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
