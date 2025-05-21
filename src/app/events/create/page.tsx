"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const schema = z.object({
  title: z.string().min(1, "Event title is required"),
  location: z.string().min(1, "Venue location is required"),
  category: z.string().min(1, "Category is required"),
  availableSeats: z
    .number({ invalid_type_error: "Seats must be a number" })
    .min(1, "At least 1 seat required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <CreateEventForm />
    </ProtectedRoute>
  );
}

function CreateEventForm() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Jakarta");
  const [customCity, setCustomCity] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const finalCity =
      selectedCity === "Other" ? customCity.trim() : selectedCity;

    const finalLocation = `${finalCity} - ${data.location}`;

    try {
      await api.post("/events", {
        ...data,
        location: finalLocation, // override location
      });

      toast.success("Event created successfully!");
      router.push("/dashboard/organizer");
    } catch (error: any) {
      console.error("Create event failed:", error.response?.data || error);
      toast.error("Failed to create event.");
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create a New Event
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Event Title"
          placeholder="e.g. Music Festival 2025"
          {...register("title")}
          error={errors.title}
        />

        {/* City Selector */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
            value={selectedCity}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCity(value);
              if (value !== "Other") {
                setCustomCity("");
              }
            }}
          >
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Denpasar">Bali</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {selectedCity === "Other" && (
          <Input
            label="Custom City"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="e.g. Malang"
          />
        )}

        <Input
          label="Venue (Location)"
          placeholder="e.g. Istora Senayan"
          {...register("location")}
          error={errors.location}
        />

        <Input
          label="Category"
          placeholder="e.g. Music, Seminar, Workshop"
          {...register("category")}
          error={errors.category}
        />

        <Input
          label="Available Seats"
          type="number"
          placeholder="e.g. 100"
          {...register("availableSeats", { valueAsNumber: true })}
          error={errors.availableSeats}
        />

        <Input
          label="Price (IDR)"
          type="number"
          placeholder="e.g. 0 (Free)"
          {...register("price", { valueAsNumber: true })}
          error={errors.price}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Describe your event in detail..."
            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>
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
  );
}
