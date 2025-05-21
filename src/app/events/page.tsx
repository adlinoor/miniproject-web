"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import EventsCard from "@/components/events/EventsCard";

interface Event {
  id: number;
  title: string;
  location: string;
  description?: string;
  price: number;
  startDate: string;
  endDate?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Events</h1>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventsCard
              key={event.id}
              event={{
                id: event.id,
                name: event.title,
                location: event.location,
                description: event.description,
                price: event.price,
                start_date: event.startDate,
                end_date: event.endDate,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No events available.</p>
      )}
    </main>
  );
}
