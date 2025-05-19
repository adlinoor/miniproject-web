"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/api-client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/lib/redux/hook";

type Event = {
  id: number;
  name: string;
  price: number;
  availableSeats: number;
};

type FormData = {
  quantity: number;
  usePoints: boolean;
  paymentProof?: FileList;
};

export default function BuyTicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to continue.");
      router.push("/auth/login");
    } else if (user.role !== "CUSTOMER") {
      toast.error("Only customers can purchase tickets.");
      router.push("/");
    }
  }, [user]);

  const { register, handleSubmit, watch } = useForm<FormData>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number>(0);

  const usePoints = watch("usePoints");
  const quantity = watch("quantity") || 1;

  useEffect(() => {
    if (!id) return;

    api.get(`/events/${id}`).then((res) => setEvent(res.data));
    api
      .get("/users/me")
      .then((res) => setPoints(res.data.totalActivePoints ?? 0));
  }, [id]);

  const finalPrice =
    event?.price !== undefined
      ? usePoints
        ? Math.max(0, event.price * quantity - points)
        : event.price * quantity
      : 0;

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("quantity", data.quantity.toString());
    formData.append("usePoints", data.usePoints ? "true" : "false");

    if (finalPrice > 0 && data.paymentProof?.[0]) {
      formData.append("paymentProof", data.paymentProof[0]);
    }

    setLoading(true);
    try {
      await api.post(`/events/${id}/transactions`, formData);
      toast.success("Checkout successful!");
      router.push("/transactions");
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p className="text-center py-20">Loading event...</p>;

  const formatCurrency = (value: number | undefined) =>
    `Rp${(value ?? 0).toLocaleString("id-ID")}`;

  return (
    <section className="max-w-2xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Checkout Ticket
      </h1>

      <div className="mb-8 space-y-1">
        <p className="text-lg font-medium text-gray-900">{event.name}</p>
        <p className="text-sm text-gray-500">
          Price per ticket:{" "}
          <strong>
            {event.price === 0 ? "Free" : formatCurrency(event.price)}
          </strong>
        </p>
        <p className="text-sm text-gray-500">
          Available Seats: <strong>{event.availableSeats}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Ticket Quantity
          </label>
          <input
            type="number"
            min="1"
            max={event.availableSeats}
            defaultValue={1}
            {...register("quantity", { valueAsNumber: true })}
            className="input"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register("usePoints")} />
            <span>Apply my reward points</span>
          </label>
          <span className="text-gray-500">
            (Reward balance: {formatCurrency(points)})
          </span>
        </div>

        {finalPrice > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Payment Proof
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("paymentProof", {
                required: {
                  value: true,
                  message: "Payment proof is required for paid events.",
                },
              })}
              className="input"
            />
          </div>
        )}

        <div className="border-t pt-4 mt-6">
          <p className="text-base font-medium text-gray-700">
            Total:{" "}
            <span className="text-primary">{formatCurrency(finalPrice)}</span>
          </p>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Processing..." : "Checkout Now"}
        </Button>
      </form>
    </section>
  );
}
