"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { z } from "zod";

// Skema validasi ID pakai Zod
const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid ID format"),
});

type Event = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  price: number;
  availableSeats: number;
};

export default function EventDetailPage() {
  const rawParams = useParams();
  const parsed = paramsSchema.safeParse(rawParams);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parsed.success) return;

    const { id } = parsed.data;

    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${id}`
        );
        setEvent(data);
      } catch (error) {
        toast.error("Failed to fetch event");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [parsed]);

  if (!parsed.success)
    return (
      <p className="text-center mt-12 text-red-600">
        Invalid event ID: {parsed.error.errors[0]?.message}
      </p>
    );

  if (loading) return <p className="text-center mt-12">Loading event...</p>;

  if (!event)
    return <p className="text-center mt-12 text-gray-500">Event not found</p>;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(event.startDate).toLocaleString()} -{" "}
        {new Date(event.endDate).toLocaleString()}
      </p>
      <p className="mb-2 font-medium">Location: {event.location}</p>
      <p className="mb-2 font-medium">Category: {event.category}</p>
      <p className="mb-2 font-medium">Price: Rp {event.price}</p>
      <p className="mb-6 font-medium">
        Available Seats: {event.availableSeats}
      </p>

      <Link
        href={`/checkout/${event.id}`}
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Book Now
      </Link>
    </section>
  );
}
