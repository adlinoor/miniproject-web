"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Event = {
  id: number;
  name: string;
  price: number;
  availableSeats: number;
};

type FormData = {
  quantity: number;
  usePoints: boolean;
  paymentProof: FileList;
};

export default function BuyTicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState<number>(0); // dari API profile

  useEffect(() => {
    axios.get(`/api/events/${id}`).then((res) => setEvent(res.data));
    axios.get("/api/users/profile").then((res) => setPoints(res.data.points));
  }, [id]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("quantity", data.quantity.toString());
    formData.append("usePoints", data.usePoints ? "true" : "false");
    formData.append("paymentProof", data.paymentProof[0]);

    setLoading(true);
    try {
      await axios.post(`/api/events/${id}/transactions`, formData);
      toast.success("Transaction created!");
      router.push("/transactions");
    } catch (error) {
      toast.error("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p>Loading event data...</p>;

  const usePoints = watch("usePoints");
  const quantity = watch("quantity") || 1;
  const finalPrice = usePoints
    ? event.price * quantity - points
    : event.price * quantity;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Buy Tickets for {event.name}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label>Quantity</label>
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          {...register("quantity", { valueAsNumber: true })}
          className="input"
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("usePoints")} />
          Use my points ({points.toLocaleString()} IDR)
        </label>

        <label>Upload Payment Proof</label>
        <input
          type="file"
          accept="image/*"
          {...register("paymentProof")}
          className="input"
        />

        <p>
          Total Price: <strong>{finalPrice.toLocaleString()} IDR</strong>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </form>
    </div>
  );
}
