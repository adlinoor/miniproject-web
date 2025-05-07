import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { Event } from "@/types/events";

export const useDebouncedSearch = (
  initialQuery: string = "",
  delay: number = 500
) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const { data, error, isLoading } = useSWR<Event[]>(
    debouncedQuery ? `/api/events?search=${debouncedQuery}` : "/api/events",
    (url: string) => axios.get(url).then((res) => res.data)
  );

  return {
    query,
    setQuery,
    events: data || [],
    isLoading,
    error,
  };
};
