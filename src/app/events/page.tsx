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

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const filteredEvents = events.filter((event) => {
    const matchText = (event.title + event.location)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchDate = startDate
      ? new Date(event.startDate) >= new Date(startDate)
      : true;
    const matchPrice = maxPrice ? event.price <= Number(maxPrice) : true;

    return matchText && matchDate && matchPrice;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Events</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search title/location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 text-black"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 text-black"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 text-black"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading...</p>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
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
        <p className="text-center text-gray-500 mt-10">
          No matching events found.
        </p>
      )}
    </main>
  );
}
