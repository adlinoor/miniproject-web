import { useState, useEffect } from "react";
import axios from "axios";
import { Event } from "@/types/event";

const useDebouncedSearch = (initialQuery: string = "", delay: number = 500) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Debounce perubahan input query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  // Fetch events saat query debounce berubah
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const url =
          debouncedQuery.trim() === ""
            ? `${process.env.NEXT_PUBLIC_API_URL}/events`
            : `${
                process.env.NEXT_PUBLIC_API_URL
              }/events?search=${encodeURIComponent(debouncedQuery)}`;

        const res = await axios.get(url);
        setEvents(res.data.data ?? res.data); // jaga-jaga backend Anda pakai { data: [...] }
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
    setEvents, // tambahkan ini agar bisa dikontrol dari luar
    isLoading,
    error,
  };
};

export default useDebouncedSearch;
