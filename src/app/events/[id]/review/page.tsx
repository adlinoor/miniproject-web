"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import axios from "axios";

type FormData = {
  rating: number;
  comment: string;
};

export default function ReviewEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`/api/events/${id}/reviews`, data);
      toast.success("Review submitted!");
      router.push(`/events/${id}`);
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label>Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          {...register("rating", { valueAsNumber: true })}
          className="input"
        />

        <label>Comment</label>
        <textarea
          {...register("comment")}
          rows={4}
          placeholder="Write your experience..."
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
