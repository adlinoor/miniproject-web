"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import api from "@/lib/api-client";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEvents = events.filter((event) =>
    (event.title + event.location)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-4 z-10">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900 drop-shadow-md">
          Explore. Create. Connect.
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
          Discovering & Crafting Your Essentials
        </p>

        {/* Action Buttons */}
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

      {/* Event List */}
      <section className="relative z-10 pt-28 pb-32 px-4 md:px-0 text-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Curated just for you. Join the rhythm of discovery.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-2 fade-in-up">
          {filteredEvents.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="card flex flex-col justify-between h-full"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1 text-primary">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-500">{event.location}</p>
                <p className="text-sm text-gray-600 mt-2">
                  📅{" "}
                  {new Date(event.startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {event.endDate &&
                    ` – ${new Date(event.endDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                <Link href={`/events/${event.id}`}>
                  <Button
                    variant="secondary"
                    className="w-full text-center font-medium"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No events match your search.
          </p>
        )}
      </section>
    </main>
  );
}
