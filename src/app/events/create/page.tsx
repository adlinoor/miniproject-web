"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const cities = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Semarang",
  "Makassar",
  "Denpasar",
  "Balikpapan",
  "Padang",
];

const categories = [
  "Technology",
  "Education",
  "Health",
  "Business",
  "Music",
  "Art",
  "Sports",
  "Religion",
  "Community",
];

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  availableSeats: z.number().nonnegative(),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
      toast.error("Start date must be before end date.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, String(value))
      );
      if (image) formData.append("image", image);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Event created successfully!");
      router.push("/events");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">
          Create New Event
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl"
        >
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-sm text-red-500">{errors.title?.message}</p>

          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-sm text-red-500">{errors.description?.message}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              {...register("startDate")}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="datetime-local"
              {...register("endDate")}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <p className="text-sm text-red-500">
            {errors.startDate?.message || errors.endDate?.message}
          </p>

          <select
            {...register("location")}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose City --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className="text-sm text-red-500">{errors.location?.message}</p>

          <select
            {...register("category")}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className="text-sm text-red-500">{errors.category?.message}</p>

          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
            min={0}
          />
          <p className="text-sm text-red-500">{errors.price?.message}</p>

          <input
            type="number"
            {...register("availableSeats", { valueAsNumber: true })}
            placeholder="Available Seats"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
            min={0}
          />
          <p className="text-sm text-red-500">
            {errors.availableSeats?.message}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded-xl"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-xl border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
