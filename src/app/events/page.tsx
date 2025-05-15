"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "@/components/events/EventsCard";
import SearchBar from "@/components/events/SearchBar";

type Event = {
  id: number;
  name: string;
  location: string;
  price: number;
  start_date: string;
  end_date: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios
      .get(`/api/events?search=${query}`)
      .then((res) => setEvents(res.data))
      .catch(console.error);
  }, [query]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
      <SearchBar onSearch={setQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </main>
  );
}
