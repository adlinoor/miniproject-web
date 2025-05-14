"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    price: 0,
    availableSeats: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "availableSeats" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      router.push("/events");
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="startDate"
            type="datetime-local"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="endDate"
            type="datetime-local"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="availableSeats"
            type="number"
            placeholder="Available Seats"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
