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

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-600 mb-1">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="mb-1">
        <strong>Date:</strong> {new Date(event.start_date).toLocaleDateString()}{" "}
        – {new Date(event.end_date).toLocaleDateString()}
      </p>
      <p className="my-4 text-gray-700">{event.description}</p>
      <p className="text-xl font-semibold mb-4">
        {event.price > 0 ? `IDR ${event.price.toLocaleString()}` : "Free"}
      </p>

      {user?.role === "CUSTOMER" && (
        <Link href={`/events/${event.id}/buy`}>
          <Button variant="primary">Join Event</Button>
        </Link>
      )}
    </div>
  );
}
