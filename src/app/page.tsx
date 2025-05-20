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
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 leading-tight">
          Discover Amazing Events
        </h1>
        <p className="text-base md:text-xl text-gray-600 max-w-xl mx-auto mb-10">
          Find, create, and manage events all in one place. Whether you're
          looking to attend or organize, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Link href="/events">
            <Button variant="primary" className="px-6 py-3 text-base shadow-md">
              🔍 Browse Events
            </Button>
          </Link>
          <Link href="/events/create">
            <Button
              variant="secondary"
              className="px-6 py-3 text-base shadow-sm"
            >
              ➕ Create Event
            </Button>
          </Link>
        </div>
      </section>

      {/* Stylish Divider */}
      <div className="flex items-center justify-center my-16">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm uppercase tracking-widest">
          Upcoming Events
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Event Preview Cards */}
      {events.length > 0 && (
        <section className="px-4 md:px-6 max-w-6xl mx-auto pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="rounded-2xl bg-white shadow-md p-6 hover:shadow-lg transition border border-gray-200 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-2xl">📅</div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-primary hover:underline font-medium underline-offset-4"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
