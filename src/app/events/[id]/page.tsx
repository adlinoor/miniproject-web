"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import api from "@/lib/api-client";
import { useAppSelector } from "@/lib/redux/hook";

interface Event {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const user = useAppSelector((state) => state.auth.user);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/events/${id}`)
      .then((res) => {
        console.log("Data event dari API:", res.data.data);
        setEvent(res.data.data);
      })
      .catch((err) => {
        console.error("Gagal ambil event:", err);
      });
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Tanggal tidak tersedia";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Tanggal tidak valid"
      : date.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };

  const formatPrice = (value?: number) =>
    typeof value === "number"
      ? value > 0
        ? `Rp${value.toLocaleString("id-ID")}`
        : "Gratis"
      : "-";

  if (!event)
    return <p className="text-center py-10">Memuat detail event...</p>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {event.title || "Nama event tidak tersedia"}
          </h1>
          <p className="text-gray-600 text-sm">
            {formatDate(event.startDate)} – {formatDate(event.endDate)}
          </p>
        </div>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Lokasi:</strong> {event.location || "-"}
          </p>
          <p>
            <strong>Harga:</strong> {formatPrice(event.price)}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Deskripsi
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description?.trim() || "Deskripsi tidak tersedia"}
          </p>
        </div>

        {user?.role === "CUSTOMER" && (
          <div className="pt-4">
            <Link href={`/events/${event.id}/buy`}>
              <Button className="w-full">Join this Event</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
