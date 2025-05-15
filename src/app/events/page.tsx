"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`
        );
        setEvents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading events...</p>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description}
              </p>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(event.startDate).toLocaleDateString()} –{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 mb-4">{event.location}</div>
              <Link
                href={`/events/${event.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
