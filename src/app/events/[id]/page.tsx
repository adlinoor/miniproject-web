"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

<<<<<<< HEAD
export const dynamic = "force-dynamic"; // 👈 agar page bisa pakai async fetch

type Props = {
  params: { id: string };
=======
type Event = {
  id: number;
  name: string;
  location: string;
  price: number;
  start_date: string;
  end_date: string;
  description: string;
>>>>>>> origin/rian
};

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    axios
      .get(`/api/events/${params.id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [params.id]);

  if (!event) return <p>Loading...</p>;

<<<<<<< HEAD
    return (
      <section className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-6">{event.description}</p>
        <div className="mb-2">
          <strong>Date:</strong>{" "}
          {new Date(event.startDate).toLocaleDateString()} -{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <strong>Location:</strong> {event.location}
        </div>
        <div className="mb-2">
          <strong>Price:</strong> Rp{event.price.toLocaleString()}
        </div>
        <div className="mb-2">
          <strong>Seats:</strong> {event.availableSeats}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);
    notFound();
  }
=======
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-500">{event.location}</p>
      <p>
        {new Date(event.start_date).toLocaleDateString()} –{" "}
        {new Date(event.end_date).toLocaleDateString()}
      </p>
      <p className="my-4">{event.description}</p>
      <p className="text-xl font-semibold">
        {event.price > 0 ? `IDR ${event.price.toLocaleString()}` : "Free"}
      </p>
    </div>
  );
>>>>>>> origin/rian
}
