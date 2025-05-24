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
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/events/${id}`)
      .then((res) => {
        console.log("📦 Event data:", res.data.data);
        setEvent(res.data.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch event:", err);
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

  if (!event) {
    return (
      <p className="text-center py-10 text-gray-500">Memuat detail event...</p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-6">
        {/* Judul & Tanggal */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {event.title || "Nama event tidak tersedia"}
          </h1>
          <p className="text-sm text-gray-500">
            📅 {formatDate(event.startDate)}
            {event.endDate && ` – ${formatDate(event.endDate)}`}
          </p>
        </header>

        {/* Lokasi & Harga */}
        <section className="space-y-2 text-gray-700 text-sm">
          <p>
            <strong>📍 Lokasi:</strong> {event.location || "-"}
          </p>
          <p>
            <strong>💰 Harga:</strong> {formatPrice(event.price)}
          </p>
        </section>

        {/* Deskripsi */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Deskripsi
          </h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {event.description?.trim() || "Deskripsi tidak tersedia"}
          </p>
        </section>

        {/* Tombol Aksi */}
        <div className="pt-4">
          {user?.role === "CUSTOMER" ? (
            <Link href={`/events/${event.id}/buy`}>
              <Button className="w-full">Join this Event</Button>
            </Link>
          ) : user?.role === "ORGANIZER" ? (
            <Link href={`/events/${event.id}/edit`}>
              <Button className="w-full">Edit This Event</Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="w-full">Login to Join</Button>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
