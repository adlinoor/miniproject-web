"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

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
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${params.id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [params.id]);

  if (!event) return <p className="text-center py-20">Loading event...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-500 mb-1">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="mb-1">
        <strong>Date:</strong> {new Date(event.start_date).toLocaleDateString()}{" "}
        – {new Date(event.end_date).toLocaleDateString()}
      </p>
      <p className="my-4">{event.description}</p>
      <p className="text-xl font-semibold">
        {event.price > 0 ? `IDR ${event.price.toLocaleString()}` : "Free"}
      </p>
    </div>
  );
}
