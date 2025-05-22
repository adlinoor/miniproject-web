"use client";

import { useState } from "react";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import EventsCard from "../events/EventsCard";
import { FiSearch, FiFilter, FiClock, FiX } from "react-icons/fi";
import { Event } from "@/types/event";
import clsx from "clsx";

export const EventSearch = () => {
  const { query, setQuery, events, isLoading, error } = useDebouncedSearch(
    "",
    800
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const filteredEvents = events.filter((event: Event) => {
    const matchCategory = categoryFilter
      ? event.category?.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchLocation = locationFilter
      ? event.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    return matchCategory && matchLocation;
  });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-blue-500">
            <FiClock className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Filter */}
        <div className="relative flex-1">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="art">Art</option>
            <option value="food">Food & Drink</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="relative flex-1">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
          Error loading events:{" "}
          {typeof error === "string" ? error : error.message}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !events.length && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Results */}
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
};
