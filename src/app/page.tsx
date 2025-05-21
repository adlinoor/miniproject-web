// ✅ file: app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import api from "@/lib/api-client";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* ✅ Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-4 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900 drop-shadow-md">
          Explore. Create. Connect.
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl">
          Discovering & Crafting Your Essentials
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/events">
            <Button variant="primary" className="px-6 py-3 text-base shadow-md">
              🔍 Browse Events
            </Button>
          </Link>
          <Link href="/events/create">
            <Button
              variant="secondary"
              className="px-6 py-3 text-base bg-white text-gray-800 hover:bg-gray-200 font-semibold shadow"
            >
              ➕ Create Event
            </Button>
          </Link>
        </div>
      </section>

      {/* ✅ Upcoming Events Section */}
      <section className="relative z-10 pt-28 pb-32 px-4 md:px-0 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Curated just for you. Join the rhythm of discovery.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-2 fade-in-up">
          {events.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="card border border-gray-200 bg-white text-gray-800 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">📅</div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {event.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {event.description}
              </p>
              <div className="mt-4 text-right">
                <Link
                  href={`/events/${event.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Background Blend Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
      </section>
    </main>
  );
}
