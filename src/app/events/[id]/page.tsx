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
      .get(`/api/events/${params.id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [params.id]);

  if (!event) return <p>Loading...</p>;

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
}
