"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import EventsCard from "@/components/events/EventsCard";
import SearchBar from "@/components/shared/SearchBar";
import { trim } from "lodash";
import api from "@/lib/api-client";

export default function EventsPage() {
  const { query, setQuery, events, setEvents, isLoading, error } =
    useDebouncedSearch("", 1000);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint =
          trim(query) === ""
            ? "/events"
            : `/events?search=${encodeURIComponent(query)}`;

        const response = await api.get(endpoint);
        setEvents(response.data.data); // pastikan response sesuai schema
      } catch (error: any) {
        if (error.response?.status === 429) {
          toast.error("Terlalu banyak permintaan. Coba lagi beberapa saat.");
        } else {
          console.error("Error fetching events:", error);
          toast.error("Gagal memuat event.");
        }
      }
    };

    fetchEvents();
  }, [query, setEvents]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Events</h1>

      <div className="max-w-md mx-auto mb-8">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
        />
      </div>

      {isLoading ? (
        <p className="text-center py-20 text-gray-500">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventsCard
              key={event.id}
              event={{
                id: event.id,
                name: event.title,
                location: event.location,
                price: event.price,
                start_date: event.startDate,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 mt-12">
          No events found.
        </p>
      )}
    </main>
  );
}
