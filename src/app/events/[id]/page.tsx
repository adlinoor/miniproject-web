"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hook";

type Event = {
  id: number;
  name: string;
  location: string;
  price: number;
  start_date: string;
  end_date: string;
  description: string;
};

export default function EventDetailPage() {
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [id]);

  if (!event) return <p className="text-center py-20">Loading event...</p>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatCurrency = (value: number) =>
    value > 0 ? `Rp${value.toLocaleString("id-ID")}` : "Free";

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {event.name}
          </h1>
          <p className="text-gray-600 text-sm">
            {formatDate(event.start_date)} – {formatDate(event.end_date)}
          </p>
        </div>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Price:</strong> {formatCurrency(event.price)}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {user?.role === "CUSTOMER" && (
          <div className="pt-4">
            <Link href={`/events/${event.id}/buy`}>
              <Button className="w-full">Join This Event</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
