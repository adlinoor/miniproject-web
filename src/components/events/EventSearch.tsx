"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import EventsCard from "./EventsCard";
import SearchBar from "../shared/SearchBar";
import { FiClock } from "react-icons/fi";
import { Event } from "@/types/event";

interface EventSearchProps {
  role?: string;
}

export default function EventSearch({ role }: EventSearchProps) {
  const { query, setQuery } = useDebouncedSearch("", 800);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const endpoint =
          role === "ORGANIZER" ? "/events/organizer/my-events" : "/events";
        const res = await api.get(endpoint);
        setEvents(res.data.data || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [role]);

  const filteredEvents = events.filter((event) => {
    const matchCategory = categoryFilter
      ? event.category?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchLocation = locationFilter
      ? event.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchText = (event.title + event.location)
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchDate = startDate
      ? new Date(event.startDate) >= new Date(startDate)
      : true;
    const matchPrice = maxPrice ? event.price <= Number(maxPrice) : true;

    return (
      matchCategory && matchLocation && matchText && matchDate && matchPrice
    );
  });

  return (
    <div className="space-y-6">
      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="art">Art</option>
          <option value="food">Food & Drink</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by location"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
          Error loading events:{" "}
          {typeof error === "string" ? error : error.message}
        </div>
      )}

      {!isLoading && (
        <>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiClock className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">
                No events found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </>
      )}
    </div>
  );
}
