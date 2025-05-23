import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import api from "@/lib/api-client";

const useDebouncedSearch = (
  initialQuery: string = "",
  delay: number = 1000
) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); // ✅ fix type

  // Debounce keyword input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  // Fetch when debouncedQuery changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const url =
          debouncedQuery.trim().length >= 2
            ? `/events?search=${encodeURIComponent(debouncedQuery)}`
            : "/events"; // ✅ fetch all when empty or too short

        const res = await api.get(url);
        setEvents(res.data.data ?? res.data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 429) {
          setError(new Error("Too many requests. Please wait a moment."));
        } else {
          setError(new Error("Failed to fetch events."));
        }
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    events,
    setEvents,
    isLoading,
    error,
  };
};

export default useDebouncedSearch;
