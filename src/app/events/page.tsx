"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import EventsCard from "@/components/events/EventsCard";
import SearchBar from "@/components/shared/SearchBar";
import { trim } from "lodash";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedSearch(query, 1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trim() === "" && query.trim() !== "") return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events?search=${debouncedQuery}`
        );
        setEvents(response.data.data || []);
      } catch (error: any) {
        if (error.response?.status === 429) {
          toast.error("Terlalu banyak permintaan. Coba lagi beberapa saat.");
        } else {
          console.error("Error fetching events:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Browse Events</h1>

      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
      />

      {loading ? (
        <p className="text-center py-20">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventsCard key={event.id} event={event} />
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
