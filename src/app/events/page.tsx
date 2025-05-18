"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import EventsCard from "@/components/events/EventsCard";
import SearchBar from "@/components/shared/SearchBar";
import { trim } from "lodash";
import api from "@/lib/api-client";

export default function EventsPage() {
  const { query, setQuery, events, isLoading, error } = useDebouncedSearch(
    "",
    1000
  );

  useEffect(() => {
    if (trim(query) === "") return;

    const fetchEvents = async () => {
      try {
        const response = await api.get(`/events?search=${query}`);
        // asumsi: data sudah dimasukkan di useDebouncedSearch
      } catch (error: any) {
        if (error.response?.status === 429) {
          toast.error("Terlalu banyak permintaan. Coba lagi beberapa saat.");
        } else {
          console.error("Error fetching events:", error);
        }
      }
    };

    fetchEvents();
  }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Browse Events</h1>

      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
      />

      {isLoading ? (
        <p className="text-center py-20">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventsCard
              key={event.id}
              event={{
                id: event.id,
                name: event.title, // asumsi dari backend pakai title
                location: event.location,
                price: event.price,
                start_date: event.startDate, // asumsi camelCase dari backend
              }}
            />
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
