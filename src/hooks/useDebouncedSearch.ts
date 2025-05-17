import { useState, useEffect } from "react";
import axios from "axios";
import { Event } from "@/types/event";

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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events?search=${debouncedQuery}`
        );
        setEvents(res.data);
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

  return { query, setQuery, events, isLoading, error };
};

export default useDebouncedSearch;
