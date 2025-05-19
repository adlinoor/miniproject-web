import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import api from "@/lib/api-client";

const useDebouncedSearch = (initialQuery: string = "", delay: number = 500) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const url =
          debouncedQuery.trim() === ""
            ? "/events"
            : `/events?search=${encodeURIComponent(debouncedQuery)}`;

        const res = await api.get(url);
        setEvents(res.data.data ?? res.data); // support both wrapped or raw array
        setError(null);
      } catch (err) {
        setError(err);
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
