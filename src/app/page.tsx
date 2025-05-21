"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import api from "@/lib/api-client";
import EventsCard from "@/components/events/EventsCard";

interface EventData {
  id: number;
  title: string;
  location: string;
  description?: string;
  price: number;
  startDate: string;
  endDate?: string;
}

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);

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
          <Link href="/events" aria-label="Browse all events">
            <Button variant="primary" className="px-6 py-3 text-base shadow-md">
              🔍 Browse Events
            </Button>
          </Link>
          <Link href="/events/create" aria-label="Create a new event">
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

        <div className="max-w-6xl mx-auto px-2 fade-in-up">
          {events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300">
              {events.slice(0, 6).map((event) => (
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
            <p className="text-center text-gray-500 py-10">
              No upcoming events available.
            </p>
          )}
        </div>

        {/* ✅ Background Blend Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
      </section>
    </main>
  );
}
