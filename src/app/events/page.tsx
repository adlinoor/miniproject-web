"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events?search=${query}`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Browse Events</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6"
      />

      {loading ? (
        <p className="text-center py-20">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 p-6 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {event.title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
              <div className="mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No events found.
        </p>
      )}
    </main>
  );
}
