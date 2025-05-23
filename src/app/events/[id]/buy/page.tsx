"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/lib/redux/hook";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";

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
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const { register, handleSubmit, watch } = useForm<FormData>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const quantity = watch("quantity") || 1;
  const usePoints = watch("usePoints");

  useEffect(() => {
    if (!id || typeof id !== "string") {
      toast.error("Invalid event ID.");
      router.push("/");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to continue.");
      router.push("/auth/login");
      return;
    }

    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can purchase tickets.");
      router.push("/");
      return;
    }

    api.get(`/events/${id}`).then((res) => setEvent(res.data.data));
    api
      .get("/users/me")
      .then((res) => setPoints(res.data.totalActivePoints ?? 0));
  }, [id, user, router]);

  const finalPrice =
    event?.price !== undefined
      ? usePoints
        ? Math.max(0, event.price * quantity - points - voucherDiscount)
        : event.price * quantity - voucherDiscount
      : 0;

  const formatCurrency = (value: number | undefined) =>
    `Rp${(value ?? 0).toLocaleString("id-ID")}`;

  const onSubmit = async (data: FormData) => {
    const eventIdNumber = parseInt(id as string);
    const quantityNumber = parseInt(String(data.quantity));

    if (!eventIdNumber || isNaN(quantityNumber) || quantityNumber < 1) {
      toast.error("Event ID atau jumlah tiket tidak valid.");
      return;
    }

    const formData = new FormData();
    formData.append("eventId", String(eventIdNumber));
    formData.append("quantity", String(quantityNumber));

    if (data.usePoints && points > 0) {
      formData.append("pointsUsed", String(points));
    }

    if (voucherCode) {
      formData.append("voucherCode", voucherCode);
    }

    if (finalPrice > 0) {
      const file = data.paymentProof?.[0];
      if (!file) {
        toast.error("Please upload your payment proof.");
        return;
      }
      formData.append("paymentProof", file);
    }

    // Debug log
    console.log("=== FormData yang dikirim ===");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    setLoading(true);
    try {
      await api.post("/transactions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Checkout successful!");
      router.push("/events/success");
    } catch (err: any) {
      console.error("❌ Response error:", err?.response?.data);
      toast.error(
        err?.response?.data?.message || "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <p className="text-center py-20">Loading event...</p>;
  }

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

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Apply Voucher
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              className="input flex-1"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <Button
              type="button"
              onClick={async () => {
                if (!voucherCode)
                  return toast.error("Please enter a voucher code.");
                try {
                  const res = await api.post("/vouchers/apply", {
                    code: voucherCode,
                    eventId: event.id,
                  });
                  setVoucherDiscount(res.data.discount);
                  toast.success(`Voucher applied: -${res.data.discount} IDR`);
                } catch (err: any) {
                  toast.error(
                    err?.response?.data?.message || "Voucher invalid"
                  );
                }
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        {finalPrice > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Payment Proof
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              {...register("paymentProof", { required: true })}
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
