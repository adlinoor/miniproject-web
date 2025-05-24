"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/api-client";

type FormData = {
  rating: number;
  comment: string;
};

export default function ReviewEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await api.post(`/events/${id}/reviews`, data);
      toast.success("Review submitted!");
      reset();
      router.push(`/events/${id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Rating <span className="text-gray-500">(1-5)</span>
          </label>
          <input
            type="number"
            min={1}
            max={5}
            step={1}
            {...register("rating", {
              required: "Rating is required",
              valueAsNumber: true,
              min: { value: 1, message: "Minimum rating is 1" },
              max: { value: 5, message: "Maximum rating is 5" },
            })}
            className="w-full border rounded px-3 py-2"
            disabled={isSubmitting}
          />
          {errors.rating && (
            <p className="text-sm text-red-500">
              {errors.rating.message?.toString() || "Rating is required (1-5)"}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Comment</label>
          <textarea
            {...register("comment", { required: "Comment is required" })}
            rows={4}
            placeholder="Write your experience..."
            className="w-full border rounded px-3 py-2"
            disabled={isSubmitting}
          />
          {errors.comment && (
            <p className="text-sm text-red-500">
              {errors.comment.message?.toString() || "Comment is required"}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
