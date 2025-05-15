"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(3),
  price: z.number().nonnegative(),
  location: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  seats: z.number().positive(),
  description: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/events", data);
      toast.success("Event created!");
      reset();
    } catch {
      toast.error("Failed to create event.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Event Name"
          className="input"
        />
        <span className="text-red-500">{errors.name?.message}</span>

        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          placeholder="Price (IDR)"
          className="input"
        />
        <span className="text-red-500">{errors.price?.message}</span>

        <input
          {...register("location")}
          placeholder="Location"
          className="input"
        />
        <span className="text-red-500">{errors.location?.message}</span>

        <input type="date" {...register("start_date")} className="input" />
        <span className="text-red-500">{errors.start_date?.message}</span>

        <input type="date" {...register("end_date")} className="input" />
        <span className="text-red-500">{errors.end_date?.message}</span>

        <input
          type="number"
          {...register("seats", { valueAsNumber: true })}
          placeholder="Available Seats"
          className="input"
        />
        <span className="text-red-500">{errors.seats?.message}</span>

        <textarea
          {...register("description")}
          placeholder="Description"
          className="input"
        />
        <span className="text-red-500">{errors.description?.message}</span>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
